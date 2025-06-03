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
exports.showNextreePanel = showNextreePanel;
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const treeGenerator_1 = require("./treeGenerator");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function showNextreePanel(context, tree) {
    const panel = vscode.window.createWebviewPanel('nextreeView', 'Nextree: Components Tree', vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
    });
    const indexPath = path.join(context.extensionPath, 'media', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(/src="\/src\/main.tsx"/, `src="${panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media/assets/main.js')))}"`);
    panel.webview.html = html;
    panel.webview.onDidReceiveMessage((msg) => {
        vscode.window.showInformationMessage('Mensagem do WebView: ' + JSON.stringify(msg));
    });
    panel.webview.postMessage(tree);
}
function activate(context) {
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
            const tree = (0, treeGenerator_1.generateNextTree)(selectedPath);
            showNextreePanel(context, tree);
            vscode.window.showInformationMessage('Next.js tree project created with success!');
        }
        catch (error) {
            vscode.window.showErrorMessage('Error creating tree: ' + error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=extension.js.map