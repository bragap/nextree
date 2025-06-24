import * as vscode from 'vscode';
import { analyzeNextJsProject } from './treeAnalyzer';
import { showTreeWebview } from './treeWebviewHost';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('nextree.showTree', async () => {
        vscode.window.showInformationMessage('Nextree comand executed!');
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const projectPath = workspaceFolders[0].uri.fsPath;
        const treeData = await analyzeNextJsProject(projectPath);
        vscode.window.showInformationMessage(`Analysis: ${treeData.nodes.length} nodes, ${treeData.edges.length} edges.`);
        if (treeData.nodes.length === 0) {
            vscode.window.showWarningMessage('No Next.js component was found in this project.');
            return;
        }
        showTreeWebview(context, treeData);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
