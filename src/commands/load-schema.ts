import {
  type IntrospectionQuery,
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} from "graphql";
import { match } from "ts-pattern";
import * as vscode from "vscode";
import { Constants } from "../constants";
import { E } from "../lib/fp/Either";
import { GQL } from "../lib/gql";
import { createFile } from "../utils/file";

type Props = {
  rootPath: string;
  endpoint: string;
};

export const loadSchema = (props: Props) => async () => {
  const { rootPath, endpoint } = props;

  try {
    const response = await GQL.send<IntrospectionQuery>({
      query: getIntrospectionQuery(),
      endpoint,
      variables: {},
      headers: {},
    });

    const result = match(response)
      .with(E.RIGHT, ({ value }) => {
        const schema = buildClientSchema(value.data);
        const schemaSDL = printSchema(schema);
        return createFile({
          folderPath: `${rootPath}/${Constants.Path.PACKAGE_PATH}/__schema__`,
          name: "schema.graphql",
          content: schemaSDL,
        });
      })
      .with(E.LEFT, () => {
        throw new Error("Error loading schema");
      })
      .exhaustive();

    match(result)
      .with(E.RIGHT, ({ value: configFilePath }) => {
        vscode.window.showInformationMessage(
          `Schema loaded at ${configFilePath}`,
        );
      })
      .with(E.LEFT, ({ value: configFilePath }) => {
        vscode.window.showErrorMessage(
          `Error loading schema at ${configFilePath}`,
        );
      })
      .exhaustive();
  } catch (error) {
    vscode.window.showErrorMessage(`Error loading schema from ${rootPath}`);
  }
};
