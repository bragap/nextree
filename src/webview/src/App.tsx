import  { useEffect, useState } from 'react';

type TreeNode = {
  name: string;
  type: string;
  isClient?: boolean;
  children?: TreeNode[];
};

export default function App() {
  const [tree, setTree] = useState<TreeNode>();

  useEffect(() => {
    window.addEventListener('message', (event) => {
      setTree(event.data);
    });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Árvore de Componentes</h1>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>
  );
}
