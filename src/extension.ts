import * as vscode from 'vscode';
import { EnvironmentTreeProvider } from './views/environmentTree';
import { GraphqlsTreeProvider } from './views/graphqlsTree';
import { getConfig } from './utils/loadConfig';

let outputChannel: vscode.OutputChannel;

function sendGraphQL({
    query = '',
    variables = {},
    endpoint,
    headers,
}: {
    query: string;
    variables: Record<string, any>;
    endpoint: string;
    headers: Record<string, string>;
}) {

    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
            query,
            variables,
        }),
    })
        .then(response => response.json())
        .then(data => {

            // Terminal 생성
            outputChannel.show(true);
            outputChannel.clear();
            outputChannel.appendLine('Hello World');
            outputChannel.appendLine(JSON.stringify(data, null, 2));
        })
        .catch(error => {
            vscode.window.showErrorMessage(error.message);
        });
}

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Graph Man');

    const environmentTreeProvider = new EnvironmentTreeProvider(context, vscode.workspace.rootPath || '');

    const environmentTreeview = vscode.window.createTreeView('graph-man-environment', { treeDataProvider: environmentTreeProvider });
    const graphqlsTreeProvider = new GraphqlsTreeProvider(vscode.workspace.rootPath || '');

    vscode.window.registerTreeDataProvider('graph-man-graphqls', graphqlsTreeProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand('graph-man.refresh-environment', () => environmentTreeProvider.refresh()),
        vscode.commands.registerCommand('graph-man.refresh-header', () => graphqlsTreeProvider.refresh()),
        vscode.commands.registerCommand('graph-man.send-graphql', async () => {
            const selectedEnvironment = context.globalState.get('selectedEnvironment') as string ?? '';
            const query = vscode.window.activeTextEditor?.document.getText() ?? '';
            const config = getConfig(vscode.workspace.rootPath || '');
            const endpoint = config.environment[selectedEnvironment]?.url ?? '';

            sendGraphQL({
                query,
                variables: {},
                endpoint,
                headers: {},
            });
        }),
    );

    environmentTreeview.onDidChangeSelection(e => {
        if (e.selection.length > 0) {
            const selectedTreeItem = e.selection[0];
            environmentTreeProvider.selectEnvironment(selectedTreeItem.label);
        }
    });
}

export function deactivate() { }