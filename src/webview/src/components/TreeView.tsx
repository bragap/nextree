import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useMemo, useState } from 'react';
import { useCallback } from 'react';
import { TreeData } from '../lib/constants';
import { getLayoutedElements, toReactFlowEdge, toReactFlowNode } from '../lib/utils';

interface TreeViewProps {
  data: TreeData
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

    return { subNodes, subEdges }},[data]
  );

  const [selectedPage, setSelectedPage] = useState(pageNodes[0]?.id);

  const { subNodes, subEdges } = useMemo(() => {
    return getSubtree(selectedPage);
  }, [getSubtree, selectedPage]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const reactFlowNodes = toReactFlowNode(subNodes);
    const reactFlowEdges = toReactFlowEdge(subEdges);
    return getLayoutedElements(reactFlowNodes, reactFlowEdges);
  }, [subNodes, subEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(layoutedNodes);
  }, [layoutedNodes, setNodes]);

  useEffect(() => {
    setEdges(layoutedEdges);
  }, [layoutedEdges, setEdges]);

  return (
    <div className='react-flow'>
      <div style={{ display: 'flex', gap: 10, alignItems:'center', marginBottom: 8, paddingBottom:8 }}>
        <p style={{fontSize: 18}}>Select the page:</p>
        <select value = {selectedPage} style={{borderRadius: 20, height: '35px', paddingLeft: '10px', paddingRight: '10px'}} onChange = {(e) => setSelectedPage(e.target.value)}>
        {pageNodes
          .filter(page => {
            const subtree = getSubtree(page.id);
            return subtree.subNodes.length > 1;
          })
          .map(page => (
              <option 
              key={page.id}
              value={page.id}
              >
                  {page.file.replace(/.*app[\\/]/, '/').replace(/[\\/][^\\/]+$/, '') || '/'}</option>
          ))}
          </select>
      </div>
      <div style={{ height: '85vh', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Background />
          <Controls className="xy-controls-button"/>
        </ReactFlow>
      </div>
    </div>
  );
}
