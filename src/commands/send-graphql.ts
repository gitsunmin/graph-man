import path from "node:path";
import * as vscode from "vscode";
import { loadConfig } from "../utils/config";
import { P, match } from "ts-pattern";
import { GQL } from "../lib/gql";

export const sendGraphQL =
	(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) =>
	async () => {
		const selectedEnvironment =
			(context.globalState.get("selectedEnvironment") as string) ?? "";
		const query = vscode.window.activeTextEditor?.document.getText() ?? "";
		const configPath = path.join(
			vscode.workspace.rootPath || "",
			".graph-man/config.json",
		);

		const config = loadConfig(configPath);

		match(config)
			.with({ __tag: "Left" }, ({ value: errorMessage }) => {
				vscode.window.showErrorMessage(errorMessage);
			})
			.with(
				{
					__tag: "Right",
					value: {
						environment: P.when(
							(environment) => !!environment[selectedEnvironment],
						),
					},
				},
				({ value: { environment } }) => {
					const { url: endpoint } = environment[selectedEnvironment];

					GQL.send({
						query,
						variables: {},
						endpoint,
						headers: {},
					}).then((result) =>
						match(result)
							.with({ __tag: "Left" }, ({ value: errorMessage }) => {
								vscode.window.showErrorMessage(errorMessage as string);
							})
							.with({ __tag: "Right" }, ({ value }) => {
								vscode.window.showInformationMessage(
									`GQL success | endpoint: ${endpoint}`,
								);
								outputChannel.show(true);
								outputChannel.clear();
								outputChannel.appendLine(JSON.stringify(value, null, 2));
							})
							.exhaustive(),
					);
				},
			)
			.otherwise(() => vscode.window.showErrorMessage("Environment not found"));
	};
