import { useEffect, useState } from 'react';
import TreeView from './components/TreeView';
import { TreeData } from './lib/constants';

declare function acquireVsCodeApi(): {
  postMessage: (msg : {type:string}) => void;
};

export default function App() {
  const [tree, setTree] = useState<TreeData | undefined>();

  useEffect(() => {
    const vscode = acquireVsCodeApi();

    vscode.postMessage({ type: 'get-tree-data' });

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'tree-data') {
        setTree(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if(!tree){
    return "Loading tree...";
  }

  return (
     <main>
       <h1>Nextree components</h1>
        <TreeView data={tree}/>
     </main>
  );
}
