import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class GraphqlsTreeProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private graphqls: any = {};

    constructor(private workspaceRoot: string) {
        this.loadConfig();
    }

    private loadConfig() {
        const configPath = path.join(this.workspaceRoot, '.graph-man/config.json');
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            this.graphqls = JSON.parse(configContent).environment;
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
            // Return header values
            const headerValues = element.details || {};
            return Promise.resolve(Object.keys(headerValues).map(key => new TreeItem(key, headerValues[key], vscode.TreeItemCollapsibleState.None)));
        } else {
            // Return graphqls
            const environments = Object.values(this.graphqls);
            const allGraphqls = environments.reduce((acc: any, env: any) => ({ ...acc, ...env.graphqls }), {}) as Record<string, string>;
            return Promise.resolve(Object.keys(allGraphqls).map(header => new TreeItem(header, allGraphqls[header], vscode.TreeItemCollapsibleState.Collapsed)));
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
        this.description = typeof this.details === 'string' ? this.details : '';
        this.iconPath = new vscode.ThemeIcon('list-tree');
    }
}