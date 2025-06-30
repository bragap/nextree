export const NODE_WIDTH = 150;
export const NODE_HEIGHT = 50;

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