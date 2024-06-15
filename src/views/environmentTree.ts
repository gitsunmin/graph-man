import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class EnvironmentTreeProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private environments: any = {};
    private selectedEnvironment: string | undefined;

    constructor(private context: vscode.ExtensionContext, private workspaceRoot: string) {
        this.loadConfig();
        this.selectedEnvironment = context.globalState.get('selectedEnvironment');
    }

    private loadConfig() {
        const configPath = path.join(this.workspaceRoot, '.graph-man/config.json');
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            this.environments = JSON.parse(configContent).environment;
            this._onDidChangeTreeData.fire();
        } else {
            vscode.window.showErrorMessage('.graph-man/config.json file not found');
        }
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {

        if (element) { return Promise.resolve([]); }
        else { return Promise.resolve(Object.keys(this.environments).map(env => new TreeItem(env, this.environments[env], this.selectedEnvironment === env))); }
    }

    refresh(): void {
        this.loadConfig();
    }

    selectEnvironment(environment: string) {
        this.selectedEnvironment = environment;
        this.context.globalState.update('selectedEnvironment', environment);
        this.refresh();
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly details: any,
        public readonly selected: boolean,
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `${this.label}: ${JSON.stringify(this.details)}`;
        this.description = details.url ? details.url : '';
        this.iconPath = new vscode.ThemeIcon(selected ? 'pass-filled' : 'circle-large-outline');
    }
}