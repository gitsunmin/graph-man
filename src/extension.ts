import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  const showGraphMan = vscode.commands.registerCommand('graph-man.show-graph-man', () => {
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(showGraphMan);
}

// This method is called when your extension is deactivated
export function deactivate() {}
