import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: 'react-flow', children: [_jsxs("div", { style: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, paddingBottom: 8 }, children: [_jsx("p", { style: { fontSize: 18 }, children: "Select the page:" }), _jsx("select", { value: selectedPage, style: { borderRadius: 20, height: '35px', paddingLeft: '10px', paddingRight: '10px' }, onChange: (e) => setSelectedPage(e.target.value), children: pageNodes
                            .filter(page => {
                            const subtree = getSubtree(page.id);
                            return subtree.subNodes.length > 1;
                        })
                            .map(page => (_jsx("option", { value: page.id, children: page.file.replace(/.*app[\\/]/, '/').replace(/[\\/][^\\/]+$/, '') || '/' }, page.id))) })] }), _jsx("div", { style: { height: '85vh', width: '100%' }, children: _jsxs(ReactFlow, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, children: [_jsx(Background, {}), _jsx(Controls, { className: "xy-controls-button" })] }) })] }));
}
