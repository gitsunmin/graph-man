import * as vscode from "vscode";

export const openFile = (filePath: string) => {
	const fileUri = vscode.Uri.file(filePath);
	vscode.window.showTextDocument(fileUri);
};
