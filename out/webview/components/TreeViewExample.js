import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
const initialNodes = [
    {
        id: '1',
        data: { label: 'Hello' },
        position: { x: 0, y: 0 },
        type: 'input',
    },
    {
        id: '2',
        data: { label: 'World' },
        position: { x: 100, y: 100 },
    },
];
const initialEdges = [
    { id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },
];
function Flow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    return (_jsx("div", { style: { height: '100%' }, children: _jsxs(ReactFlow, { nodes: nodes, onNodesChange: onNodesChange, edges: edges, onEdgesChange: onEdgesChange, fitView: true, children: [_jsx(Background, {}), _jsx(Controls, {})] }) }));
}
export default Flow;
