import * as fs from 'fs';
import * as path from 'path';

export interface GraphNode {
    id: string;
    label: string;
    file: string;
    type: 'client' | 'server';
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

    for (const file of files) {
        const id = path.relative(projectPath, file);
        const content = fs.readFileSync(file, 'utf-8');
        // Detecta client/server component
        const isClient = /^(['\"]use client['\"];?)/m.test(content.split('\n').slice(0, 5).join('\n'));
        nodes.push({
            id,
            label: path.basename(file) + (isClient ? ' (client)' : ' (server)'),
            file: id,
            type: isClient ? 'client' : 'server',
        });
    }

    for (const file of files) {
        const id = path.relative(projectPath, file);
        const content = fs.readFileSync(file, 'utf-8');
        const importRegex = /import\s+.*?from\s+['\"](.*?)['\"]/g;
        let match;
        while ((match = importRegex.exec(content))) {
            let importPath = match[1];
            if (importPath.startsWith('.')) {
                let importedFile = path.resolve(path.dirname(file), importPath);
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
