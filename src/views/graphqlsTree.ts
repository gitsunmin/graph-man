import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class GraphqlFilesProvider implements vscode.TreeDataProvider<TreeNode> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined | null> = new vscode.EventEmitter<TreeNode | undefined | null>();
	readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined | null> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string) { }

	getTreeItem(element: TreeNode): vscode.TreeItem {
		return element;
	}

	getChildren(element?: TreeNode): Thenable<TreeNode[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No .graphql or .gql files found in empty workspace');
			return Promise.resolve([]);
		}

		const directoryPath = element ? element.fullPath : this.workspaceRoot;
		return Promise.resolve(this.scanDirectory(directoryPath));
	}

	private scanDirectory(directoryPath: string): TreeNode[] {
		if (!fs.existsSync(directoryPath)) {
			return [];
		}

		const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
		const nodes: TreeNode[] = [];

		for (const entry of entries) {
			const fullPath = path.join(directoryPath, entry.name);
			if (entry.isDirectory()) {
				const childNodes = this.scanDirectory(fullPath);
				if (childNodes.length > 0) {
					nodes.push(new TreeNode(entry.name, fullPath, vscode.TreeItemCollapsibleState.Collapsed, childNodes));
				}
			} else if (entry.isFile() && (entry.name.endsWith('.graphql') || entry.name.endsWith('.gql'))) {
				nodes.push(new TreeNode(entry.name, fullPath, vscode.TreeItemCollapsibleState.None, [], {
					command: 'graph-man.open-file',
					title: "Open File",
					arguments: [fullPath]
				}));
			}
		}

		return nodes;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(null);
	}
}

class TreeNode extends vscode.TreeItem {
	children: TreeNode[];

	constructor(
		public readonly label: string,
		public readonly fullPath: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		children: TreeNode[] = [],
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		this.children = children;
		this.tooltip = `${this.label}`;
		this.description = this.fullPath;
	}
}

export function activate(/* context: vscode.ExtensionContext */) {
	vscode.window.showInformationMessage(`Opening ${vscode.workspace.rootPath}`);
	const workspaceRoot = vscode.workspace.rootPath || '';
	const graphqlFilesProvider = new GraphqlFilesProvider(workspaceRoot);
	vscode.window.registerTreeDataProvider('graphqlFiles', graphqlFilesProvider);
}