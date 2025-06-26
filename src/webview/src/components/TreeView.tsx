import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { TreeData, TreeNode } from '../lib/constants';

interface TreeViewProps {
  data: TreeData
}

const getNodeBackground = (n:TreeNode) => {
  if(n.label === 'page.tsx') return('#ff0000');

  switch (n.type){
  case('client') :
  return ('#4caf50')
  case ('server'):
    return ('#2196f3')
  case ('store'):
    return('#ff9800')
  default:
     return('#ff0000')
}
}


export default function TreeView({ data }: TreeViewProps) {

  const pageNodes = data.nodes.filter(n =>
    /^page\.(t|j)sx?$/.test(n.label.replace(/ \(client\)| \(server\)/, ''))
  );

  const getSubtree = useCallback((pageId: string) => {
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
    const subEdges = data.edges.filter(e => visited.has(e.from) && visited.has(e.to));

    return { subNodes, subEdges };
  },
    [data]
  );



  const [selectedPage, setSelectedPage] = useState(pageNodes[0]?.id);

  const { subNodes, subEdges } = useMemo(() => {
    return getSubtree(selectedPage);
  }, [getSubtree, selectedPage]);

  const nodes: Node[] = useMemo(() => {

    const gridCols = Math.ceil(Math.sqrt(subNodes.length));

    return subNodes.map((n, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;

      return {
        id: n.id,
        data: { label: n.label },
        position: {x:0,y:0},
        style: {
          background: getNodeBackground(n),
          color: 'white',
          borderRadius: '8px',
          width: 160,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 12,
          textAlign: 'center',
          padding: '4px',
          border: '2px solid #333',
          overflow: 'hidden',
          wordBreak: 'break-word',
        },
      };
    });
  }, [subNodes])

  const edges: Edge[] = useMemo(() => {
    console.log('Creating edges from subEdges:', subEdges.length);

    const edgeMap = new Map<string, string[]>();
    subEdges.forEach(edge => {
      if (!edgeMap.has(edge.from)) {
        edgeMap.set(edge.from, []);
      }
      edgeMap.get(edge.from)!.push(edge.to);
    });

    console.log('Edge connections:', Array.from(edgeMap.entries()).slice(0, 5));

    return subEdges.map(e => ({
      id: `${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      animated: false,
      style: {
        stroke: '#666',
        strokeWidth: 1,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#666',
        width: 15,
        height: 15,
      },
    }));
  }, [subEdges])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {pageNodes
        .filter(page => {
         const subtree = getSubtree(page.id);
         return subtree.subNodes.length > 1;
        })
        .map(page => (
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
