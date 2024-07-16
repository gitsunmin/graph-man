import path from "node:path";
import { P, match } from "ts-pattern";
import * as vscode from "vscode";
import { Constants } from "../constants";
import { E } from "../lib/fp/Either";
import { GQL } from "../lib/gql";
import { loadConfig } from "../utils/config";

export const sendGraphQL =
  (context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) =>
  async () => {
    const selectedEnvironment =
      (context.globalState.get("selectedEnvironment") as string) ?? "";
    const query = vscode.window.activeTextEditor?.document.getText() ?? "";
    const configPath = path.join(
      vscode.workspace.rootPath || "",
      Constants.Path.CONFIG_FILE_PATH,
    );

    const config = loadConfig(configPath);

    match(config)
      .with(E.LEFT, ({ value: errorMessage }) => {
        vscode.window.showErrorMessage(errorMessage);
      })
      .with(
        {
          ...E.RIGHT,
          value: {
            environment: P.when(
              (environment) => !!environment[selectedEnvironment],
            ),
          },
        },
        ({ value: { environment } }) => {
          const { url: endpoint = "", headers = {} } =
            environment[selectedEnvironment] || {};

          GQL.send({
            query,
            variables: {},
            endpoint,
            headers,
          }).then((result) => {

            outputChannel.show(true);
            outputChannel.replace(JSON.stringify(result.value, null, 2))

            match(result)
              .with(E.LEFT, () => {
                vscode.window.showErrorMessage(
                  `GQL error | endpoint: ${endpoint}`,
                );
              })
              .with(E.RIGHT, () => {
                vscode.window.showInformationMessage(
                  `GQL success | endpoint: ${endpoint}`,
                );
              })
              .exhaustive();
          });
        },
      )
      .otherwise(() => vscode.window.showErrorMessage("Environment not found"));
  };
