// create-example-graphql-file
import * as path from "node:path";
import { match } from "ts-pattern";
import * as vscode from "vscode";
import { E } from "../lib/fp/Either";
import { createFile } from "../utils/file";

type Props = {
  rootPath: string;
  forderName: string;
};

export const createExampleGraphqlFile = (props: Props) => () => {
  const { rootPath, forderName } = props;

  const GRAPHQL_CONTENTS = `
query IntrospectionQuery {
    __schema {
        types {
            name
        }
    }
}

    `;

  const createdGraphQLFile = createFile({
    folderPath: path.join(rootPath, forderName),
    name: "graph-man-example.graphql",
    content: GRAPHQL_CONTENTS,
  });

  match(createdGraphQLFile)
    .with(E.RIGHT, ({ value: filePath }) => {
      vscode.window.showInformationMessage(`Created ${filePath}`);
    })
    .with(E.LEFT, ({ value: filePath }) => {
      vscode.window.showErrorMessage(
        `Failed to create ${filePath}: already exists`,
      );
    })
    .exhaustive();
};
