import * as vscode from 'vscode';
import { EnvironmentTreeProvider } from './views/environmentTree';
import { GraphqlsTreeProvider } from './views/graphqlsTree';
import path from 'path';
import { loadConfig } from './utils/config';
import { P, match } from 'ts-pattern';
import { GQL } from './utils/gql';
import outputChannel from './utils/outputChannel';


export function activate(context: vscode.ExtensionContext) {

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
            const configPath = path.join(vscode.workspace.rootPath || '', '.graph-man/config.json');

            const config = loadConfig(configPath);

            match(config)
                .with({ __tag: 'Left' }, ({ value: errorMessage }) => {
                    vscode.window.showErrorMessage(errorMessage);
                })
                .with({
                    __tag: 'Right', value: {
                        environment: P.when((environment) => !!environment[selectedEnvironment])
                    }
                }, ({ value: { environment } }) => {
                    const { url: endpoint } = environment[selectedEnvironment];

                    GQL.send({
                        query,
                        variables: {},
                        endpoint,
                        headers: {},
                    }).then((result) => match(result)
                        .with({ __tag: 'Left' }, ({ value: errorMessage }) => {
                            vscode.window.showErrorMessage(errorMessage as string);
                        })
                        .with({ __tag: 'Right' }, ({ value }) => {
                            outputChannel.show(true);
                            outputChannel.clear();
                            outputChannel.appendLine('Send GQL:');
                            outputChannel.appendLine(`endpoint: ${endpoint}`);
                            outputChannel.appendLine(`= = = = = = = = = = = = = = = = = =`);
                            outputChannel.appendLine(JSON.stringify(value, null, 2));
                        })
                        .exhaustive()
                    );

                })
                .otherwise(() => vscode.window.showErrorMessage('Environment not found'));

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