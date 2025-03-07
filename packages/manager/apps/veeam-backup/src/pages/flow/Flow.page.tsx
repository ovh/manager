import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  Handle,
  Position,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { routes } from '@/routes/routes.test';

// Define the structure of a route
interface Tracking {
  description: string;
  type: string;
  pageType?: string;
  pageName?: string;
  buttonType?: string;
  actionType?: string;
  actions?: string[];
}

// interface Route {
//   path: string;
//   tracking?: Tracking[];
//   children?: Route[];
// }

// Generate React Flow nodes and edges
const generateGraphData = (
  // routes: Route[],
  routes: any[],
  parentId: string | null = null,
  level: number = 0,
) => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  routes.forEach((route, index) => {
    const nodeId = `${parentId ? parentId + '-' : ''}${index}`;
    const trackingInfo = route.tracking
      ? route.tracking.map((t) => t.description).join(', ')
      : 'No tracking';

    nodes.push({
      id: nodeId,
      data: { label: `${route.path}\n(${trackingInfo})` },
      position: { x: level * 250, y: index * 100 },
      style: {
        backgroundColor: route.tracking?.some((t) => t.type === 'page.display')
          ? '#D9E1F2'
          : '#FFFFFF',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #000',
      },
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        animated: true,
      });
    }

    if (route.children) {
      const childGraph = generateGraphData(route.children, nodeId, level + 1);
      nodes = [...nodes, ...childGraph.nodes];
      edges = [...edges, ...childGraph.edges];
    }
  });

  return { nodes, edges };
};

const FlowPageComponent: React.FC = () => {
  const { nodes, edges } = generateGraphData(routes);
  const [flowNodes, setFlowNodes] = useState<Node[]>(nodes);
  const [flowEdges, setFlowEdges] = useState<Edge[]>(edges);

  const onNodesChange = useCallback(
    (changes: any) => setFlowNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setFlowEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowPageComponent;
