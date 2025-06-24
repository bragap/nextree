import * as vscode from 'vscode';
import { analyzeNextJsProject } from './nextjsAnalyzer';
import { showGraphWebview } from './graphWebviewPanel';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('nextree.showGraph', async () => {
        vscode.window.showInformationMessage('Nextree comand executed!');
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const projectPath = workspaceFolders[0].uri.fsPath;
        const graphData = await analyzeNextJsProject(projectPath);
        vscode.window.showInformationMessage(`Analysis: ${graphData.nodes.length} nodes, ${graphData.edges.length} edges.`);
        if (graphData.nodes.length === 0) {
            vscode.window.showWarningMessage('Anyone Next.js component was found in this project.');
            return;
        }
        showGraphWebview(context, graphData);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
