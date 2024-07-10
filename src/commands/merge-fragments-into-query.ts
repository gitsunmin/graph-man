import {
  type ASTVisitor,
  type DocumentNode,
  type FieldNode,
  type FragmentDefinitionNode,
  type GraphQLOutputType,
  type GraphQLSchema,
  Kind,
  type SelectionNode,
  TypeInfo,
  buildASTSchema,
  getNamedType,
  parse,
  print,
  visit,
  visitWithTypeInfo,
} from "graphql";
import { match } from "ts-pattern";
import * as vscode from "vscode";
import { O } from "../lib/fp/Options";
import { readFileSync } from "../utils/file";

export const mergeFragmentsIntoQuery = (schemaPath: string) => () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  match(readFileSync<string>(schemaPath))
    .with(O.SOME, (schemaString) => {
      const schema = buildASTSchema(parse(schemaString.value));

      const document = editor.document;
      const text = document.getText();
      let ast: DocumentNode;

      try {
        ast = parse(text);
      } catch (error) {
        vscode.window.showErrorMessage("Failed to parse GraphQL query");
        return;
      }

      const mergedQuery = print(mergeAst(ast, schema));

      editor.edit((editBuilder) => {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(document.lineCount, 0);
        editBuilder.replace(new vscode.Range(start, end), mergedQuery);
      });

      vscode.window.showInformationMessage(
        "GraphQL fragments merged successfully",
      );
    })
    .with(O.NONE, () => {
      vscode.window.showErrorMessage("Failed to read schema file");
    })
    .exhaustive();
};

/**
 * Given a document AST, inline all named fragment definitions.
 */
export function mergeAst(
  documentAST: DocumentNode,
  schema?: GraphQLSchema | null,
): DocumentNode {
  // If we're given the schema, we can simplify even further by resolving object
  // types vs unions/interfaces
  const typeInfo = schema ? new TypeInfo(schema) : null;

  const fragmentDefinitions: {
    [key: string]: FragmentDefinitionNode | undefined;
  } = Object.create(null);

  for (const definition of documentAST.definitions) {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      fragmentDefinitions[definition.name.value] = definition;
    }
  }

  const flattenVisitors: ASTVisitor = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    SelectionSet(node: any) {
      const selectionSetType = typeInfo ? typeInfo.getParentType() : null;
      let { selections } = node;

      selections = inlineRelevantFragmentSpreads(
        fragmentDefinitions,
        selections,
        selectionSetType,
      );

      return {
        ...node,
        selections,
      };
    },
    FragmentDefinition() {
      return null;
    },
  };

  const flattenedAST = visit(
    documentAST,
    typeInfo ? visitWithTypeInfo(typeInfo, flattenVisitors) : flattenVisitors,
  );

  const deduplicateVisitors: ASTVisitor = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    SelectionSet(node: any) {
      let { selections } = node;

      selections = uniqueBy(selections, (selection) =>
        selection.alias ? selection.alias.value : selection.name.value,
      );

      return {
        ...node,
        selections,
      };
    },
    FragmentDefinition() {
      return null;
    },
  };

  return visit(flattenedAST, deduplicateVisitors);
}

function uniqueBy<T>(
  array: readonly SelectionNode[],
  iteratee: (item: FieldNode) => T,
) {
  const FilteredMap = new Map<T, FieldNode>();
  const result: SelectionNode[] = [];
  for (const item of array) {
    if (item.kind === "Field") {
      const uniqueValue = iteratee(item);
      const existing = FilteredMap.get(uniqueValue);
      if (item.directives?.length) {
        // Cannot inline fields with directives (yet)
        const itemClone = { ...item };
        result.push(itemClone);
      } else if (existing?.selectionSet && item.selectionSet) {
        // Merge the selection sets
        existing.selectionSet.selections = [
          ...existing.selectionSet.selections,
          ...item.selectionSet.selections,
        ];
      } else if (!existing) {
        const itemClone = { ...item };
        FilteredMap.set(uniqueValue, itemClone);
        result.push(itemClone);
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

function inlineRelevantFragmentSpreads(
  fragmentDefinitions: {
    [key: string]: FragmentDefinitionNode | undefined;
  },
  selections: readonly SelectionNode[],
  selectionSetType?: GraphQLOutputType | null,
): readonly SelectionNode[] {
  const selectionSetTypeName = selectionSetType
    ? getNamedType(selectionSetType).name
    : null;
  const outputSelections = [];
  const seenSpreads: string[] = [];
  for (let selection of selections) {
    if (selection.kind === "FragmentSpread") {
      const fragmentName = selection.name.value;
      if (!selection.directives || selection.directives.length === 0) {
        if (seenSpreads.includes(fragmentName)) {
          /* It's a duplicate - skip it! */
          continue;
          // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
          seenSpreads.push(fragmentName);
        }
      }
      const fragmentDefinition = fragmentDefinitions[selection.name.value];
      if (fragmentDefinition) {
        const { typeCondition, directives, selectionSet } = fragmentDefinition;
        selection = {
          kind: Kind.INLINE_FRAGMENT,
          typeCondition,
          directives,
          selectionSet,
        };
      }
    }
    if (
      selection.kind === Kind.INLINE_FRAGMENT &&
      // Cannot inline if there are directives
      (!selection.directives || selection.directives?.length === 0)
    ) {
      const fragmentTypeName = selection.typeCondition
        ? selection.typeCondition.name.value
        : null;
      if (!fragmentTypeName || fragmentTypeName === selectionSetTypeName) {
        outputSelections.push(
          ...inlineRelevantFragmentSpreads(
            fragmentDefinitions,
            selection.selectionSet.selections,
            selectionSetType,
          ),
        );
        continue;
      }
    }
    outputSelections.push(selection);
  }
  return outputSelections;
}
