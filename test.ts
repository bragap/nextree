import { generateNextTree } from './src/treeGenerator';

const tree = generateNextTree('./app');
console.dir(tree, { depth: null });