import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  getBezierPath,
} from '@xyflow/react';
import { Network, Maximize2, Sparkles, Building2 } from 'lucide-react';

/**
 * Custom Node component representing a Campus Building.
 */
function BuildingNode({ data }) {
  return (
    <div className="building-node">
      {/* Target/Source handles for clean routing from all sides */}
      <Handle type="target" position={Position.Top} id="t-top" style={{ background: '#2563EB', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Top} id="s-top" style={{ background: '#2563EB', width: 6, height: 6 }} />
      
      <Handle type="target" position={Position.Right} id="t-right" style={{ background: '#2563EB', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Right} id="s-right" style={{ background: '#2563EB', width: 6, height: 6 }} />

      <Handle type="target" position={Position.Bottom} id="t-bottom" style={{ background: '#2563EB', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Bottom} id="s-bottom" style={{ background: '#2563EB', width: 6, height: 6 }} />

      <Handle type="target" position={Position.Left} id="t-left" style={{ background: '#2563EB', width: 6, height: 6 }} />
      <Handle type="source" position={Position.Left} id="s-left" style={{ background: '#2563EB', width: 6, height: 6 }} />

      <div className="building-node-code">{data.code}</div>
      <div className="building-node-name" title={data.name}>
        {data.name}
      </div>
    </div>
  );
}

/**
 * Custom Edge component with styled Cost & Distance label.
 */
function CampusEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isMst = data?.isMst || false;
  const cost = data?.cost || 0;
  const distance = data?.distance;

  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`edge-label-badge ${isMst ? 'mst-edge' : 'normal-edge'}`}
        >
          <span className="edge-cost">₹{Number(cost).toLocaleString('en-IN')}</span>
          {distance && <span className="edge-dist">{distance}</span>}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = { buildingNode: BuildingNode };
const edgeTypes = { campusEdge: CampusEdge };

export default function NetworkGraph({ buildings, connections, mstResult, isMSTComputed }) {
  // Pre-calculate positions in a circular topology for clean layout
  const nodes = useMemo(() => {
    const total = buildings.length;
    if (total === 0) return [];

    const centerX = 360;
    const centerY = 240;
    const radius = Math.min(220, 70 + total * 25);

    return buildings.map((b, i) => {
      const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle) - 70;
      const y = centerY + radius * Math.sin(angle) - 40;

      return {
        id: b.code,
        type: 'buildingNode',
        position: { x, y },
        data: { code: b.code, name: b.name },
      };
    });
  }, [buildings]);

  // Edges creation and MST coloring
  const edges = useMemo(() => {
    const mstEdgeSet = new Set();
    if (isMSTComputed && mstResult?.mst) {
      mstResult.mst.forEach((edge) => {
        // Record both directions since undirected
        mstEdgeSet.add(`${edge.from}->${edge.to}`);
        mstEdgeSet.add(`${edge.to}->${edge.from}`);
      });
    }

    return connections.map((c) => {
      const isMst = mstEdgeSet.has(`${c.from}->${c.to}`) || mstEdgeSet.has(`${c.to}->${c.from}`);
      const edgeId = c.id || `edge-${c.from}-${c.to}`;

      return {
        id: edgeId,
        source: c.from,
        target: c.to,
        type: 'campusEdge',
        animated: isMst,
        data: {
          cost: c.cost,
          distance: c.distance,
          isMst,
        },
        style: isMst
          ? {
              stroke: '#10B981',
              strokeWidth: 4,
              filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))',
            }
          : {
              stroke: '#94A3B8',
              strokeWidth: 2,
              strokeDasharray: '4 4',
              opacity: isMSTComputed ? 0.45 : 0.8,
            },
        zIndex: isMst ? 10 : 1,
      };
    });
  }, [connections, mstResult, isMSTComputed]);

  return (
    <div className="card graph-container-card">
      <div className="card-header">
        <h2 className="card-title">
          <Network size={18} color="var(--primary)" />
          Campus Network
        </h2>
        <div className="graph-legend">
          <div className="legend-item">
            <span className="legend-indicator normal"></span>
            <span>Available Route</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator mst"></span>
            <span>Selected MST Cable</span>
          </div>
        </div>
      </div>

      <div className="graph-canvas">
        {buildings.length === 0 ? (
          <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Building2 className="empty-state-icon" size={48} />
            <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No Campus Map to Display</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Add buildings or load the demo campus to view the interactive network graph.</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.3}
            maxZoom={2}
          >
            <Background color="#CBD5E1" gap={20} size={1.5} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={() => '#2563EB'}
              maskColor="rgba(241, 245, 249, 0.7)"
              style={{ height: 90, width: 130 }}
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
