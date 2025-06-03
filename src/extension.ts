import * as vscode from 'vscode';
import { generateNextTree } from './treeGenerator';
import * as path from 'path';
import * as fs from 'fs';

export function showNextreePanel(context: vscode.ExtensionContext, tree: any) {
  const panel = vscode.window.createWebviewPanel(
    'nextreeView',
    'Nextree: Components Tree',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
    }
  );

  const indexPath = path.join(context.extensionPath, 'media', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(/src="\/src\/main.tsx"/, `src="${panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'media/assets/main.js'))
  )}"`);

  panel.webview.html = html;

  panel.webview.onDidReceiveMessage((msg) => {
    vscode.window.showInformationMessage('Mensagem do WebView: ' + JSON.stringify(msg));
  });

  panel.webview.postMessage(tree);
}


export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('nextree.selectProject', async () => {
    const uri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      openLabel: 'Select Next.js project',
    });

    if (!uri || uri.length === 0) {
      vscode.window.showErrorMessage('No folder was selected.');
      return;
    }

    const selectedPath = uri[0].fsPath;

    try {
      const tree = generateNextTree(selectedPath);
      showNextreePanel(context, tree);

      vscode.window.showInformationMessage('Next.js tree project created with success!');
    } catch (error) {
      vscode.window.showErrorMessage('Error creating tree: ' + error);
    }
  });

  context.subscriptions.push(disposable);
}
