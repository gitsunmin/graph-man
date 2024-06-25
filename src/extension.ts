import path from "node:path";
import * as vscode from "vscode";
import { openFile } from "./commands/open-file";
import { sendGraphQL } from "./commands/send-graphql";
import outputChannel from "./utils/outputChannel";
import { EnvironmentTreeProvider } from "./views/environmentTree";
import { GraphqlFilesProvider } from "./views/graphqlsTree";

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath || '';

	const environmentTreeProvider = new EnvironmentTreeProvider(
		context,
		rootPath,
	);
	const graphqlFilesTreeProvider = new GraphqlFilesProvider(
		path.join(rootPath),
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
		vscode.commands.registerCommand(
			'graph-man.show-configuration',
			() => {
				openFile(path.join(rootPath, '.graph-man/config.json'));
			}
		),
		vscode.commands.registerCommand("graph-man.open-file", openFile),
	);

	environmentTreeview.onDidChangeSelection((e) => {
		if (e.selection.length > 0) {
			const selectedTreeItem = e.selection[0];
			environmentTreeProvider.selectEnvironment(selectedTreeItem.label);
		}
	});
}

export function deactivate() {}
