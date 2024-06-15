import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class EnvironmentTreeProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private environments: any = {};

    constructor(private workspaceRoot: string) {
        this.loadConfig();
    }

    private loadConfig() {
        const configPath = path.join(this.workspaceRoot, '.graph-man/config.json');
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            this.environments = JSON.parse(configContent).environment;
            this._onDidChangeTreeData.fire();
        } else {
            vscode.window.showErrorMessage('config.json file not found');
        }
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (element) {
            // Return headers
            const headers = this.environments[element.label]?.headers || {};
            return Promise.resolve(Object.keys(headers).map(key => new TreeItem(key, headers[key], vscode.TreeItemCollapsibleState.None)));
        } else {
            // Return environments
            return Promise.resolve(Object.keys(this.environments).map(env => new TreeItem(env, this.environments[env], vscode.TreeItemCollapsibleState.Collapsed)));
        }
    }

    refresh(): void {
        this.loadConfig();
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly details: any,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}: ${JSON.stringify(this.details)}`;
        this.description = this.details.url ? this.details.url : '';
        this.iconPath = new vscode.ThemeIcon('none');
    }
}