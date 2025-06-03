import * as fs from 'fs';
import * as path from 'path';

type NodeType = 'folder' | 'layout' | 'page' | 'template' | 'error' | 'loading' | 'route' | 'component';

export interface TreeNode {
  name: string;
  type: NodeType;
  isClient?: boolean; 
  children?: TreeNode[];
}

const nextFileTypes: Record<string, NodeType> = {
  'layout.tsx': 'layout',
  'page.tsx': 'page',
  'template.tsx': 'template',
  'error.tsx': 'error',
  'loading.tsx': 'loading',
  'route.ts': 'route',
};

function isClientComponent(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return /^\s*['"]use client['"]/.test(content);
  } catch {
    return false;
  }
}

function walkDirectory(dir: string, context: 'app' | 'components'): TreeNode {
  const children: TreeNode[] = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      children.push(walkDirectory(fullPath, context));
    } else {
      const ext = path.extname(file);
      const base = path.basename(file);

      if (context === 'app') {
        const type = nextFileTypes[base];
        if (!type) continue

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

export function generateNextTree(baseDir: string): {
  app: TreeNode | null;
  components: TreeNode | null;
} {
  const appPath = path.join(baseDir, 'app');
  const componentsPath = path.join(baseDir, 'components');

  const app = fs.existsSync(appPath) ? walkDirectory(appPath, 'app') : null;
  const components = fs.existsSync(componentsPath)
    ? walkDirectory(componentsPath, 'components')
    : null;

  return { app, components };
}
