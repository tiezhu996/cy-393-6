import ReactFlow, { Background, Controls, MiniMap, applyEdgeChanges, applyNodeChanges, type EdgeChange, type NodeChange } from "reactflow";
import { THEMES } from "../../constants/themes";
import { useAutoSave } from "../../hooks/useAutoSave";
import { useMindMapStore } from "../../stores/mindMapStore";
import { MindNode } from "./MindNode";

const nodeTypes = { default: MindNode };

export function MindMapCanvas({ id }: { id: string }) {
  const store = useMindMapStore();
  const active = store.active();
  useAutoSave(active);
  if (!active) return null;
  const theme = THEMES[active.theme as keyof typeof THEMES] ?? THEMES.business;
  const nodes = active.nodes.map((node) => ({ ...node, data: { ...node.data, bg: theme.node, color: theme.text } }));
  function onNodesChange(changes: NodeChange[]) { store.setNodesEdges(applyNodeChanges(changes, active.nodes), active.edges); }
  function onEdgesChange(changes: EdgeChange[]) { store.setNodesEdges(active.nodes, applyEdgeChanges(changes, active.edges)); }
  return <div id={id} className="h-full w-full">
    <ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={active.edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={(_, node) => store.selectNode(node.id)} fitView>
      <Background /><Controls /><MiniMap pannable zoomable nodeColor={() => theme.node} />
    </ReactFlow>
  </div>;
}
