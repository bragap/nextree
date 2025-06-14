import * as vscode from 'vscode';
import { analyzeNextJsProject } from './analyzer';
import { showGraphWebview } from './webview';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('nextree.showGraph', async () => {
        vscode.window.showInformationMessage('Comando Nextree executado!');
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }
        const projectPath = workspaceFolders[0].uri.fsPath;
        const graphData = await analyzeNextJsProject(projectPath);
        vscode.window.showInformationMessage(`Análise: ${graphData.nodes.length} nodes, ${graphData.edges.length} edges.`);
        if (graphData.nodes.length === 0) {
            vscode.window.showWarningMessage('Nenhum componente Next.js encontrado no projeto.');
            return;
        }
        showGraphWebview(context, graphData);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
