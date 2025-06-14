import * as fs from 'fs';
import * as path from 'path';

export interface GraphNode {
    id: string;
    label: string;
    file: string;
}

export interface GraphEdge {
    from: string;
    to: string;
}

export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

const IGNORED_DIRS = ['node_modules', '.next', 'out', 'dist', '.git'];

export async function analyzeNextJsProject(projectPath: string): Promise<GraphData> {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const files: string[] = [];

    function walk(dir: string) {
        for (const entry of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, entry);
            if (fs.statSync(fullPath).isDirectory()) {
                if (IGNORED_DIRS.includes(entry)) continue;
                walk(fullPath);
            } else if (/\.(js|jsx|ts|tsx)$/.test(entry)) {
                files.push(fullPath);
            }
        }
    }
    walk(projectPath);

    // Log quantidade de arquivos encontrados
    if (files.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Nenhum arquivo .js/.jsx/.ts/.tsx encontrado no projeto!');
    } else {
        // eslint-disable-next-line no-console
        console.log(`Foram encontrados ${files.length} arquivos JS/TS.`);
    }

    // Cria nodes para cada arquivo
    for (const file of files) {
        const id = path.relative(projectPath, file);
        nodes.push({ id, label: path.basename(file), file: id });
    }

    // Cria edges para cada import
    for (const file of files) {
        const id = path.relative(projectPath, file);
        const content = fs.readFileSync(file, 'utf-8');
        const importRegex = /import\s+.*?from\s+['\"](.*?)['\"]/g;
        let match;
        while ((match = importRegex.exec(content))) {
            let importPath = match[1];
            if (importPath.startsWith('.')) {
                let importedFile = path.resolve(path.dirname(file), importPath);
                // Tenta encontrar o arquivo real
                let found = files.find(f => f.startsWith(importedFile));
                if (found) {
                    const to = path.relative(projectPath, found);
                    edges.push({ from: id, to });
                }
            }
        }
    }

    return { nodes, edges };
}
