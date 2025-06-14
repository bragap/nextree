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
exports.analyzeNextJsProject = analyzeNextJsProject;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const IGNORED_DIRS = ['node_modules', '.next', 'out', 'dist', '.git'];
async function analyzeNextJsProject(projectPath) {
    const nodes = [];
    const edges = [];
    const files = [];
    function walk(dir) {
        for (const entry of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, entry);
            if (fs.statSync(fullPath).isDirectory()) {
                if (IGNORED_DIRS.includes(entry))
                    continue;
                walk(fullPath);
            }
            else if (/\.(js|jsx|ts|tsx)$/.test(entry)) {
                files.push(fullPath);
            }
        }
    }
    walk(projectPath);
    // Log quantidade de arquivos encontrados
    if (files.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Nenhum arquivo .js/.jsx/.ts/.tsx encontrado no projeto!');
    }
    else {
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
//# sourceMappingURL=analyzer.js.map