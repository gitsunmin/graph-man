// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('graph-man.open-graph-man', function () {
    const panel = vscode.window.createWebviewPanel(
      'newEditor', // Identifies the type of the webview. Used internally
      "New Editor", // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {} // Webview options. More on these later.
    );
    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(disposable);
}

/**
 * 이 웹뷰에서 사용할 HTML 컨텐츠를 반환
 */
function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Editor</title>
  </head>
  <body>
    <h1>Hello from your new editor!</h1>
  </body>
  </html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
