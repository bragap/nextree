import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface TreeNode {
    id: string;
    label: string;
    file: string;
    type: 'client' | 'server' | 'store';
}

export interface TreeEdge {
    from: string;
    to: string;
}

export interface TreeData {
    nodes: TreeNode[];
    edges: TreeEdge[];
}

const IGNORED_DIRS = ['node_modules', '.next', 'out', 'dist', '.git'];

export async function analyzeNextJsProject(projectPath: string): Promise<TreeData> {
    const nodes: TreeNode[] = [];
    const edges: TreeEdge[] = [];
    const files: string[] = [];
    const fileToId = new Map<string, string>();

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
        const id = randomUUID();
        const content = fs.readFileSync(file, 'utf-8');
        const pathFile = path.relative(projectPath, file);

        const isStore = /store|zustand|redux/i.test(path.basename(file)) ||
            /from ['"](zustand|redux|@reduxjs\/toolkit)['"]/.test(content) ||
            /createContext\s*\(/.test(content) ||
            /from ['"]react['"];?/.test(content) && /createContext/.test(content);
        if (isStore) {
            nodes.push({
                id,
                label: path.basename(file),
                file: pathFile,
                type: 'store',
            });
            fileToId.set(pathFile, id);
            continue;
        }

        const isClient = /^(['"]use client['\"];?)/m.test(content.split('\n').slice(0, 5).join('\n'));
        nodes.push({
            id,
            label: path.basename(file),
            file: path.relative(projectPath, file),
            type: isClient ? 'client' : 'server',
        });
        fileToId.set(pathFile, id);
    }

    for (const file of files) {
        const pathFile = path.relative(projectPath, file);
        const fromId = fileToId.get(pathFile);
        if(!fromId) continue;

        const content = fs.readFileSync(file, 'utf-8');
        const importRegex = /import\s+.*?from\s+['\"](.*?)['\"]/g;
        let match;
        while ((match = importRegex.exec(content))) {
            let importPath = match[1];
            if (importPath.startsWith('.')) {
                let importedFile = path.resolve(path.dirname(file), importPath);
                let found = files.find(f => f.startsWith(importedFile));
                if (found) {
                    const toPathFile = path.relative(projectPath, found);
                    const toId = fileToId.get(toPathFile);
                    if(!toId) continue;
                    edges.push({ from: fromId, to: toId });
                }
            }
        }
    }

    return { nodes, edges };
}
