import { generateNextTree } from './treeGenerator';

const tree = generateNextTree('./app');
console.dir(tree, { depth: null });