import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { MarkerType } from "@xyflow/react";
import Dagre from '@dagrejs/dagre';
export const getNodeBackground = (n) => {
    if (n.label === 'page.tsx')
        return ('#ff0000');
    switch (n.type) {
        case ('client'):
            return ('#4caf50');
        case ('server'):
            return ('#2196f3');
        case ('store'):
            return ('#ff9800');
        default:
            return ('#ff0000');
    }
};
export const toReactFlowNode = (treeNode) => {
    const nodes = treeNode.map(treeNode => ({
        id: treeNode.id,
        data: { label: treeNode.label },
        position: { x: 0, y: 0 },
        style: {
            background: getNodeBackground(treeNode),
            color: 'white',
            borderRadius: '8px',
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 12,
            padding: '5px',
            border: '1px solid #333',
            overflow: 'hidden',
        }
    }));
    return nodes;
};
export const toReactFlowEdge = (treeEdge) => {
    const edges = treeEdge.map(treeEdge => ({
        id: `${treeEdge.from}-${treeEdge.to}`,
        source: treeEdge.from,
        target: treeEdge.to,
        style: {
            stroke: '#666',
            strokeWidth: 2,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#666',
            width: 15,
            height: 15,
        },
    }));
    return edges;
};
export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50, });
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => g.setNode(node.id, {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
    }));
    Dagre.layout(g);
    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            const x = position.x - NODE_WIDTH / 2;
            const y = position.y - NODE_HEIGHT / 2;
            return { ...node, position: { x, y } };
        }),
        edges,
    };
};
