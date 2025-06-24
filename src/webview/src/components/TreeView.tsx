import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { TreeData } from '../lib/constants';

interface TreeViewProps{
    data: TreeData
}

export default function TreeView({ data }: TreeViewProps) {
  const pageNodes = data.nodes.filter(n =>
    /^page\.(t|j)sx?$/.test(n.label.replace(/ \(client\)| \(server\)/, ''))
  );


  const getSubtree = useCallback(
    (pageId: string) => {
      const visited = new Set<string>();
      function dfs(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        data.edges
          .filter(e => e.from === nodeId)
          .forEach(e => dfs(e.to));
      }
      dfs(pageId);
      const subNodes = data.nodes.filter(n => visited.has(n.id));
      const subEdges = data.edges.filter(
        e => visited.has(e.from) && visited.has(e.to)
      );
      return { subNodes, subEdges };
    },
    [data]
  );

  const [selectedPage, setSelectedPage] = useState(pageNodes[0]?.id);

  const { subNodes, subEdges } = useMemo(
    () => getSubtree(selectedPage),
    [getSubtree, selectedPage]
  );

  const nodes:Node[] =
    subNodes.map((n, index) => ({
      id: n.id,
      data: { label: n.label },
      position: { x: 100 * index, y: 100 },
      style: {
        background:
          n.type === 'client'
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
    }))

  const edges: Edge[] =
    subEdges.map(e => ({
      id: `${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      animated: true,
    }))
  

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {pageNodes.map(page => (
          <button
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            style={{
              fontWeight: selectedPage === page.id ? 'bold' : 'normal',
              padding: '4px 8px',
            }}
          >
            {page.id.replace(/.*app[\\/]/, '/').replace(/[\\/][^\\/]+$/, '') ||
              '/'}
          </button>
        ))}
      </div>
      <div style={{ height: '85vh', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
