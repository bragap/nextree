import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../globals.css';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useMemo, useState } from 'react';
import { useCallback } from 'react';
import { getLayoutedElements, toReactFlowEdge, toReactFlowNode } from '../lib/utils';
export default function TreeView({ data }) {
    const pageNodes = data.nodes.filter(n => /^page\.(t|j)sx?$/.test(n.label.replace(/ \(client\)| \(server\)/, '')));
    const getSubtree = useCallback((pageId) => {
        const visited = new Set();
        function dfs(nodeId) {
            if (visited.has(nodeId))
                return;
            visited.add(nodeId);
            data.edges
                .filter(e => e.from === nodeId)
                .forEach(e => dfs(e.to));
        }
        dfs(pageId);
        const subNodes = data.nodes.filter(n => visited.has(n.id));
        const subEdges = data.edges.filter(e => visited.has(e.from) && visited.has(e.to));
        return { subNodes, subEdges };
    }, [data]);
    const [selectedPage, setSelectedPage] = useState(pageNodes[0]?.id);
    const { subNodes, subEdges } = useMemo(() => {
        return getSubtree(selectedPage);
    }, [getSubtree, selectedPage]);
    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
        const reactFlowNodes = toReactFlowNode(subNodes);
        const reactFlowEdges = toReactFlowEdge(subEdges);
        return getLayoutedElements(reactFlowNodes, reactFlowEdges);
    }, [subNodes, subEdges]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    useEffect(() => {
        setNodes(layoutedNodes);
    }, [layoutedNodes, setNodes]);
    useEffect(() => {
        setEdges(layoutedEdges);
    }, [layoutedEdges, setEdges]);
    return (_jsxs("div", { className: 'react-flow', children: [_jsxs("div", { className: "tree-view-header", children: [_jsxs("div", { className: "tree-view-controls", children: [_jsx("p", { className: "tree-view-label", children: "Select the page:" }), _jsx("select", { value: selectedPage, className: "tree-view-select", onChange: (e) => setSelectedPage(e.target.value), children: pageNodes
                                    .filter(page => {
                                    const subtree = getSubtree(page.id);
                                    return subtree.subNodes.length > 1;
                                })
                                    .map(page => (_jsx("option", { value: page.id, children: page.file.replace(/.*app[\\/]/, '/').replace(/[\\/][^\\/]+$/, '') || '/' }, page.id))) })] }), _jsxs("div", { children: [_jsx("p", { className: "tree-view-caption-title", children: "Caption" }), _jsxs("div", { className: "tree-view-legend", children: [_jsxs("div", { className: "tree-view-legend-item", children: [_jsx("span", { children: "Root page.tsx" }), _jsx("div", { className: "tree-view-legend-color tree-view-legend-color--default" })] }), _jsxs("div", { className: "tree-view-legend-item", children: [_jsx("span", { children: "Client component:" }), _jsx("div", { className: "tree-view-legend-color tree-view-legend-color--client" })] }), _jsxs("div", { className: "tree-view-legend-item", children: [_jsx("span", { children: "Server component:" }), _jsx("div", { className: "tree-view-legend-color tree-view-legend-color--server" })] }), _jsxs("div", { className: "tree-view-legend-item", children: [_jsx("span", { children: "Store:" }), _jsx("div", { className: "tree-view-legend-color tree-view-legend-color--store" })] })] })] })] }), _jsx("div", { className: "tree-view-flow-container", children: _jsxs(ReactFlow, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, children: [_jsx(Background, {}), _jsx(Controls, { className: "xy-controls-button" })] }) })] }));
}
