import * as vscode from "vscode";
import * as fs from "node:fs";
import { O, type Option } from "../lib/fp/Options";

export const readJSONSync = <T>(path: string): Option<T> => {
	try {
		return fs.existsSync(path)
			? O.Some(JSON.parse(fs.readFileSync(path, "utf-8")) as T)
			: O.None();
	} catch (error) {
		return O.None();
	}
};

export const readDirSync = (path: string): Option<string[]> => {
	try {
		return fs.existsSync(path) ? O.Some(fs.readdirSync(path)) : O.None();
	} catch (error) {
		return O.None();
	}
};

export const openFile = (filePath: string) => {
	const fileUri = vscode.Uri.file(filePath);
	vscode.window.showTextDocument(fileUri);
};
