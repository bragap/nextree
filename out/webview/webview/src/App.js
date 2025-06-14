import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export default function App() {
    const [tree, setTree] = useState();
    useEffect(() => {
        window.addEventListener('message', (event) => {
            setTree(event.data);
        });
    }, []);
    return (_jsxs("div", { style: { padding: 16 }, children: [_jsx("h1", { children: "\u00C1rvore de Componentes" }), _jsx("pre", { children: JSON.stringify(tree, null, 2) })] }));
}
//# sourceMappingURL=App.js.map