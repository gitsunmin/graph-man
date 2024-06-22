import * as vscode from "vscode";
import { EnvironmentTreeProvider } from "./views/environmentTree";
import { GraphqlsTreeProvider } from "./views/graphqlsTree";
import outputChannel from "./utils/outputChannel";
import { sendGraphQL } from "./commands/send-graphql";

export function activate(context: vscode.ExtensionContext) {
	const environmentTreeProvider = new EnvironmentTreeProvider(
		context,
		vscode.workspace.rootPath || "",
	);
	const graphqlsTreeProvider = new GraphqlsTreeProvider(
		context,
		vscode.workspace.rootPath || "",
	);

	const environmentTreeview = vscode.window.createTreeView(
		"graph-man-environment",
		{ treeDataProvider: environmentTreeProvider },
	);
	vscode.window.createTreeView("graph-man-graphqls", {
		treeDataProvider: graphqlsTreeProvider,
	});

	vscode.window.registerTreeDataProvider(
		"graph-man-graphqls",
		graphqlsTreeProvider,
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"graph-man.refresh-environment",
			environmentTreeProvider.refresh,
		),
		vscode.commands.registerCommand(
			"graph-man.refresh-header",
			graphqlsTreeProvider.refresh,
		),

		vscode.commands.registerCommand(
			"graph-man.send-graphql",
			sendGraphQL(context, outputChannel),
		),
	);

	environmentTreeview.onDidChangeSelection((e) => {
		if (e.selection.length > 0) {
			const selectedTreeItem = e.selection[0];
			environmentTreeProvider.selectEnvironment(selectedTreeItem.label);
		}
	});
}

export function deactivate() {}
