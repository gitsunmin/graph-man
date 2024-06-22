import * as vscode from "vscode";
import { Constants } from "../constants";

const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel(
	Constants.System.DISPLAY_NAME,
);

export default outputChannel;
