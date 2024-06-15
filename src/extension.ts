import * as vscode from 'vscode';
import { EnvironmentTreeProvider } from './views/environmentTree';
import { GraphqlsTreeProvider } from './views/graphqlsTree';

export function activate(context: vscode.ExtensionContext) {
    const environmentTreeProvider = new EnvironmentTreeProvider(vscode.workspace.rootPath || '');
    const graphqlsTreeProvider = new GraphqlsTreeProvider(vscode.workspace.rootPath || '');

    vscode.window.registerTreeDataProvider('graph-man-environment', environmentTreeProvider);
    vscode.window.registerTreeDataProvider('graph-man-graphqls', graphqlsTreeProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand('graph-man.refreshEnvironment', () => environmentTreeProvider.refresh()),
        vscode.commands.registerCommand('graph-man.refreshHeader', () => graphqlsTreeProvider.refresh()),
        vscode.commands.registerCommand('graph-man.selectEnvironment', (node) => selectEnvironment(node))
    );

    let selectedEnvironment = context.workspaceState.get('selectedEnvironment', null);
    if (selectedEnvironment) {
        vscode.window.showInformationMessage(`Selected Environment: ${selectedEnvironment}`);
    }
}

async function selectEnvironment(node: any) {
    const selected = await vscode.window.showQuickPick([node.label], { placeHolder: 'Select Environment' });
    if (selected) {
        vscode.window.showInformationMessage(`Selected Environment: ${selected}`);
        vscode.commands.executeCommand('setContext', 'selectedEnvironment', selected);
    }
}

export function deactivate() {}