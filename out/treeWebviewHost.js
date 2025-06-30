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
exports.showTreeWebview = showTreeWebview;
const vscode = __importStar(require("vscode"));
function showTreeWebview(context, treeData) {
    const panel = vscode.window.createWebviewPanel('nextreeComponents', 'Nextree Component Tree', vscode.ViewColumn.One, { enableScripts: true,
        localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'node_modules'),
            vscode.Uri.joinPath(context.extensionUri, 'media', 'assets')
        ]
    });
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    panel.webview.onDidReceiveMessage((message) => {
        if (message && message.type === 'get-tree-data') {
            panel.webview.postMessage({ type: "tree-data", data: treeData });
        }
    });
    panel.webview.postMessage({ type: 'tree-data', data: treeData });
}
function getWebviewContent(webview, extensionUri) {
    const reactAppUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'assets', 'main.js'));
    const mainCssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'assets', 'main.css'));
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Nextree Component</title>
        <link href="${mainCssUri}" rel="stylesheet">
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="${reactAppUri}"></script>
    </body>
    </html>
    `;
}
//# sourceMappingURL=treeWebviewHost.js.map