import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import TreeView from './components/TreeView';
import { ReactFlowProvider } from '@xyflow/react';
export default function App() {
    const [tree, setTree] = useState();
    useEffect(() => {
        const vscode = acquireVsCodeApi();
        vscode.postMessage({ type: 'get-tree-data' });
        const handleMessage = (event) => {
            if (event.data?.type === 'tree-data') {
                setTree(event.data.data);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    if (!tree) {
        return "Loading tree...";
    }
    return (_jsxs("main", { children: [_jsx("h1", { children: "Nextree components" }), _jsx(ReactFlowProvider, { children: _jsx(TreeView, { data: tree }) })] }));
}
