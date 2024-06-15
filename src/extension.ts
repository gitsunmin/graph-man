import * as vscode from 'vscode';
import { EnvironmentTreeProvider } from './views/environmentTree';
import { GraphqlsTreeProvider } from './views/graphqlsTree';

export function activate(context: vscode.ExtensionContext) {
    const environmentTreeProvider = new EnvironmentTreeProvider(context, vscode.workspace.rootPath || '');

    const environmentTreeview = vscode.window.createTreeView('graph-man-environment', { treeDataProvider: environmentTreeProvider });
    const graphqlsTreeProvider = new GraphqlsTreeProvider(vscode.workspace.rootPath || '');

    vscode.window.registerTreeDataProvider('graph-man-graphqls', graphqlsTreeProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand('graph-man.refresh-environment', () => environmentTreeProvider.refresh()),
        vscode.commands.registerCommand('graph-man.refresh-header', () => graphqlsTreeProvider.refresh()),
        environmentTreeview
    );


    environmentTreeview.onDidChangeSelection(e => {
        if (e.selection.length > 0) {
            const selectedTreeItem = e.selection[0];
            environmentTreeProvider.selectEnvironment(selectedTreeItem.label);
        }
    });
}

async function selectEnvironment(node: any) {
    const selected = await vscode.window.showQuickPick([node.label], { placeHolder: 'Select Environment' });
    if (selected) {
        vscode.window.showInformationMessage(`Selected Environment: ${selected}`);
        vscode.commands.executeCommand('setContext', 'selectedEnvironment', selected);
    }
}

export function deactivate() { }