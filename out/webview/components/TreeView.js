import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState } from 'react';
import { useCallback } from 'react';
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
    const { subNodes, subEdges } = useMemo(() => getSubtree(selectedPage), [getSubtree, selectedPage]);
    const nodes = subNodes.map((n, index) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: 100 * index, y: 100 },
        style: {
            background: n.type === 'client'
                ? '#4caf50'
                : n.type === 'server'
                    ? '#2196f3'
                    : '#ff9800',
            color: 'white',
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 12,
            textAlign: 'center',
            padding: 0,
        },
    }));
    const edges = subEdges.map(e => ({
        id: `${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        animated: true,
    }));
    return (_jsxs("div", { children: [_jsx("div", { style: { display: 'flex', gap: 8, marginBottom: 8 }, children: pageNodes.map(page => (_jsx("button", { onClick: () => setSelectedPage(page.id), style: {
                        fontWeight: selectedPage === page.id ? 'bold' : 'normal',
                        padding: '4px 8px',
                    }, children: page.id.replace(/.*app[\\/]/, '/').replace(/[\\/][^\\/]+$/, '') ||
                        '/' }, page.id))) }), _jsx("div", { style: { height: '85vh', width: '100%' }, children: _jsxs(ReactFlow, { nodes: nodes, edges: edges, children: [_jsx(Background, {}), _jsx(Controls, {})] }) })] }));
}
