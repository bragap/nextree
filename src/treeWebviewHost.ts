import * as vscode from 'vscode';
import { TreeData } from './treeAnalyzer';

export function showTreeWebview(context: vscode.ExtensionContext, treeData: TreeData) {
    const panel = vscode.window.createWebviewPanel(
        'nextreeComponents',
        'Nextree Component Tree',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    panel.webview.onDidReceiveMessage((message) => {
        if(message && message.type === 'get-tree-data'){
            panel.webview.postMessage({type:"tree-data", data: treeData})
        }
    })
    panel.webview.postMessage({ type: 'tree-data', data: treeData });
}

function getWebviewContent( webview: vscode.Webview, extensionUri: vscode.Uri): string {
    
    const reactAppUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'assets', 'main.js')
    );

   return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Nextree Component Tree</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="${reactAppUri}"></script>
    </body>
    </html>
    `;
}
