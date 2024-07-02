import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { Constants } from "../constants";
import type { Environment } from "../utils/config";

export class EnvironmentTreeProvider
	implements vscode.TreeDataProvider<TreeItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<
		TreeItem | undefined | null
	> = new vscode.EventEmitter<TreeItem | undefined | null>();
	readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null> =
		this._onDidChangeTreeData.event;

	private environments: Record<string, unknown> = {};
	private selectedEnvironment: string | undefined;

	constructor(
		private context: vscode.ExtensionContext,
		private workspaceRoot: string,
	) {
		this.loadConfig();
		this.selectedEnvironment = context.globalState.get("selectedEnvironment");
	}

	private loadConfig() {
		const configPath = path.join(
			this.workspaceRoot,
			Constants.Path.CONFIG_FILE_PATH,
		);
		if (fs.existsSync(configPath)) {
			const configContent = fs.readFileSync(configPath, "utf-8");
			this.environments = JSON.parse(configContent).environment;
			this._onDidChangeTreeData.fire(undefined);
		} else {
			vscode.window.showErrorMessage(
				`${Constants.Path.CONFIG_FILE_PATH} file not found`,
			);
		}
	}

	getTreeItem(element: TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: TreeItem): Thenable<TreeItem[]> {
		if (element) {
			return Promise.resolve([]);
		}
		return Promise.resolve(
			Object.keys(this.environments).map(
				(env) =>
					new TreeItem(
						env,
						(this.environments[env] as Environment) ?? {},
						this.selectedEnvironment === env,
					),
			),
		);
	}

	refresh(): void {
		this.loadConfig();
	}

	selectEnvironment(environment: string) {
		this.selectedEnvironment = environment;
		this.context.globalState.update("selectedEnvironment", environment);
		this.refresh();
	}
}

class TreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly details: Environment,
		public readonly selected: boolean,
	) {
		super(label, vscode.TreeItemCollapsibleState.None);
		this.tooltip = `${this.label}: ${JSON.stringify(this.details)}`;
		this.description = (details?.url as string | undefined) ?? "";
		this.iconPath = new vscode.ThemeIcon(
			selected ? "pass-filled" : "circle-large-outline",
		);
	}
}
