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
exports.showReactWebview = showReactWebview;
const vscode = __importStar(require("vscode"));
function showReactWebview(context, graphData) {
    const panel = vscode.window.createWebviewPanel('nextreeGraph', 'Nextree Component Graph', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    panel.webview.onDidReceiveMessage((message) => {
        if (message && message.type === 'get-graph-data') {
            panel.webview.postMessage({ type: "graph-data", data: graphData });
        }
    });
    panel.webview.postMessage({ type: 'graph-data', data: graphData });
}
function getWebviewContent(webview, extensionUri) {
    const reactAppUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'assets', 'main.js'));
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Nextree components</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="${reactAppUri}"></script>
    </body>
    </html>
    `;
}
//# sourceMappingURL=webviewHost.js.map