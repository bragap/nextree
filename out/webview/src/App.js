"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = require("react");
function App() {
    const [tree, setTree] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        window.addEventListener('message', (event) => {
            setTree(event.data);
        });
    }, []);
    return (<div style={{ padding: 16 }}>
      <h1>Árvore de Componentes</h1>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>);
}
//# sourceMappingURL=App.js.map