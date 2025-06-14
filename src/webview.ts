import * as vscode from 'vscode';
import * as path from 'path';
import { GraphData } from './analyzer';

export function showGraphWebview(context: vscode.ExtensionContext, graphData: GraphData) {
    const panel = vscode.window.createWebviewPanel(
        'nextjsGraph',
        'Next.js Component Graph',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );
    panel.webview.html = getWebviewContent(graphData, panel.webview, context.extensionUri);
}

function getWebviewContent(graphData: GraphData, webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // Usa vis-network via CDN
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Next.js Component Graph</title>
        <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
        <style>
            #mynetwork { width: 100vw; height: 90vh; border: 1px solid #ccc; }
        </style>
    </head>
    <body>
        <h2>Next.js Component Graph</h2>
        <div id="mynetwork"></div>
        <script>
            const nodes = new vis.DataSet(${JSON.stringify(graphData.nodes.map(n => ({ id: n.id, label: n.label })))});
            const edges = new vis.DataSet(${JSON.stringify(graphData.edges)});
            const container = document.getElementById('mynetwork');
            const data = { nodes, edges };
            const options = { layout: { improvedLayout: true }, physics: { enabled: true } };
            new vis.Network(container, data, options);
        </script>
    </body>
    </html>
    `;
}
