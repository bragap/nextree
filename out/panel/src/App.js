import React, { useEffect, useState } from 'react';
const App = () => {
    const [tree, setTree] = useState(null);
    useEffect(() => {
        window.addEventListener('message', (event) => {
            const data = event.data;
            setTree(data);
        });
    }, []);
    const renderNode = (node, depth = 0) => {
        return (<div key={`${node.name}-${depth}`} style={{ marginLeft: depth * 20, padding: '4px' }}>
        📁 {node.name} ({node.type}) {node.isClient ? '⚡' : ''}
        {node.children && node.children.map(child => renderNode(child, depth + 1))}
      </div>);
    };
    if (!tree)
        return <div>Carregando árvore...</div>;
    return (<div>
      <h1>🌳 Árvore do Projeto Next.js</h1>
      {tree.app && renderNode(tree.app)}
      {tree.components && renderNode(tree.components)}
    </div>);
};
export default App;
//# sourceMappingURL=App.js.map