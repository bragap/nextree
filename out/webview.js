"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.showGraphWebview = showGraphWebview;
const vscode = __importStar(require("vscode"));
function showGraphWebview(context, graphData) {
    const panel = vscode.window.createWebviewPanel('nextjsGraph', 'Next.js Component Graph', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getWebviewContent(graphData, panel.webview, context.extensionUri);
}
function getWebviewContent(graphData, webview, extensionUri) {
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
//# sourceMappingURL=webview.js.map