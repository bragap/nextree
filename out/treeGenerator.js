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
exports.generateNextTree = generateNextTree;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const nextFileTypes = {
    'layout.tsx': 'layout',
    'page.tsx': 'page',
    'template.tsx': 'template',
    'error.tsx': 'error',
    'loading.tsx': 'loading',
    'route.ts': 'route',
};
function isClientComponent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return /^\s*['"]use client['"]/.test(content);
    }
    catch {
        return false;
    }
}
function walkDirectory(dir, context) {
    const children = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            children.push(walkDirectory(fullPath, context));
        }
        else {
            const ext = path.extname(file);
            const base = path.basename(file);
            if (context === 'app') {
                const type = nextFileTypes[base];
                if (!type)
                    continue;
                children.push({
                    name: file,
                    type,
                    isClient: isClientComponent(fullPath),
                });
            }
            if (context === 'components') {
                if (ext === '.tsx' || ext === '.jsx') {
                    children.push({
                        name: file,
                        type: 'component',
                        isClient: isClientComponent(fullPath),
                    });
                }
            }
        }
    }
    return {
        name: path.basename(dir),
        type: 'folder',
        children,
    };
}
function generateNextTree(baseDir) {
    const appPath = path.join(baseDir, 'app');
    const componentsPath = path.join(baseDir, 'components');
    const app = fs.existsSync(appPath) ? walkDirectory(appPath, 'app') : null;
    const components = fs.existsSync(componentsPath)
        ? walkDirectory(componentsPath, 'components')
        : null;
    return { app, components };
}
//# sourceMappingURL=treeGenerator.js.map