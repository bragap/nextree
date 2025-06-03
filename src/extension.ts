import * as vscode from 'vscode';
import { generateNextTree } from './treeGenerator';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('nextree.selectProject', async () => {
    const uri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      openLabel: 'Selecionar projeto Next.js',
    });

    if (!uri || uri.length === 0) {
      vscode.window.showErrorMessage('Nenhuma pasta foi selecionada.');
      return;
    }

    const selectedPath = uri[0].fsPath;

    try {
      const tree = generateNextTree(selectedPath);

      // Exibe como JSON no console ou em uma output channel por enquanto
      const output = vscode.window.createOutputChannel('Nextree');
      output.appendLine('📦 Estrutura detectada:');
      output.appendLine(JSON.stringify(tree, null, 2));
      output.show();

      vscode.window.showInformationMessage('Árvore do projeto Next.js gerada com sucesso!');
    } catch (error) {
      vscode.window.showErrorMessage('Erro ao gerar a árvore: ' + error);
    }
  });

  context.subscriptions.push(disposable);
}
