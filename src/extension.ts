import path from "node:path";
import * as vscode from "vscode";
import { createConfigFile } from "./commands/create-config-file";
import { createExampleGraphqlFile } from "./commands/create-example-graphql-file";
import { createStarterPack } from "./commands/create-starter-pack";
import { loadSchema } from "./commands/load-schema";
import { mergeFragmentsIntoQuery } from "./commands/merge-fragments-into-query";
import { sendGraphQL } from "./commands/send-graphql";
import { Constants } from "./constants";
import { openFile } from "./utils/file";
import { EnvironmentTreeProvider } from "./views/environmentTree";
import { GraphqlFilesProvider } from "./views/graphqlsTree";

const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel(
  Constants.System.DISPLAY_NAME,
);

const rootPath = vscode.workspace.rootPath || "";

export function activate(context: vscode.ExtensionContext) {
  const environmentTreeProvider = new EnvironmentTreeProvider(
    context,
    rootPath,
  );
  const graphqlFilesTreeProvider = new GraphqlFilesProvider(
    path.join(rootPath, Constants.Path.PACKAGE_PATH),
  );

  const environmentTreeview = vscode.window.createTreeView(
    "graph-man-environment",
    { treeDataProvider: environmentTreeProvider },
  );
  vscode.window.createTreeView("graph-man-graphqls", {
    treeDataProvider: graphqlFilesTreeProvider,
  });

  vscode.window.registerTreeDataProvider(
    "graph-man-graphqls",
    graphqlFilesTreeProvider,
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("graph-man.refresh-environment", () =>
      environmentTreeProvider.refresh(),
    ),
    vscode.commands.registerCommand("graph-man.refresh-graphqls", () => {
      graphqlFilesTreeProvider.refresh();
    }),
    vscode.commands.registerCommand(
      "graph-man.send-graphql",
      sendGraphQL(context, outputChannel),
    ),
    vscode.commands.registerCommand("graph-man.show-configuration", () => {
      openFile(path.join(rootPath, Constants.Path.CONFIG_FILE_PATH));
    }),
    vscode.commands.registerCommand("graph-man.open-file", openFile),
    vscode.commands.registerCommand(
      "graph-man.create-config-file",
      createConfigFile({
        rootPath,
        forderName: Constants.Path.PACKAGE_PATH,
      }),
    ),
    vscode.commands.registerCommand(
      "graph-man.create-example-graphql-file",
      createExampleGraphqlFile({
        forderName: Constants.Path.PACKAGE_PATH,
        rootPath,
      }),
    ),
    vscode.commands.registerCommand(
      "graph-man.create-starter-pack",
      createStarterPack({
        forderName: Constants.Path.PACKAGE_PATH,
        rootPath,
      }),
    ),
    vscode.commands.registerCommand(
      "graph-man.load-schema",
      loadSchema({ context, rootPath }),
    ),
    vscode.commands.registerCommand(
      "graph-man.merge-fragments-into-query",
      mergeFragmentsIntoQuery(
        path.join(rootPath, Constants.Path.SCHEMA_FILE_PATH),
      ),
    ),
  );

  environmentTreeview.onDidChangeSelection((e) => {
    if (e.selection.length > 0) {
      const selectedTreeItem = e.selection[0];
      if (selectedTreeItem) {
        environmentTreeProvider.selectEnvironment(selectedTreeItem.label);
      }
    }
  });
}

export function deactivate() {}
