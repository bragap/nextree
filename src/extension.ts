import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('nextjsComponentTree.showTree', () => {
    const panel = vscode.window.createWebviewPanel(
      'nextjsComponentTree',
      'Next.js Component Tree',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: sans-serif;
          padding: 2rem;
        }
      </style>
    </head>
    <body>
      <h1>Next.js Component Tree</h1>
      <p>Soon: interactive visualization here.</p>
    </body>
    </html>
  `;
}
