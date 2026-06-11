import type { Edge, Node } from "reactflow";

export function subtreeIds(rootId: string, edges: Edge[]): string[] {
  const ids = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    edges.forEach((edge) => {
      if (ids.has(edge.source) && !ids.has(edge.target)) { ids.add(edge.target); changed = true; }
    });
  }
  return Array.from(ids);
}

export interface SubtreeData {
  nodes: Node[];
  edges: Edge[];
  rootId: string;
}

export function extractSubtree(rootId: string, nodes: Node[], edges: Edge[]): SubtreeData {
  const ids = subtreeIds(rootId, edges);
  return {
    nodes: nodes.filter((node) => ids.includes(node.id)),
    edges: edges.filter((edge) => ids.includes(edge.source) && ids.includes(edge.target)),
    rootId
  };
}

export function cloneSubtree(subtree: SubtreeData, offsetX: number = 0, offsetY: number = 0): SubtreeData {
  const idMap = new Map<string, string>();
  const newNodes: Node[] = subtree.nodes.map((node) => {
    const newId = crypto.randomUUID();
    idMap.set(node.id, newId);
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY
      },
      data: { ...node.data }
    };
  });
  const newEdges: Edge[] = subtree.edges.map((edge) => ({
    ...edge,
    id: `${idMap.get(edge.source) ?? edge.source}-${idMap.get(edge.target) ?? edge.target}`,
    source: idMap.get(edge.source) ?? edge.source,
    target: idMap.get(edge.target) ?? edge.target
  }));
  return {
    nodes: newNodes,
    edges: newEdges,
    rootId: idMap.get(subtree.rootId) ?? subtree.rootId
  };
}

export function toMarkdown(nodes: Node[], edges: Edge[]) {
  const root = nodes.find((node) => !edges.some((edge) => edge.target === node.id)) ?? nodes[0];
  const lines: string[] = [];
  function walk(id: string, depth: number) {
    const node = nodes.find((item) => item.id === id);
    if (!node) return;
    lines.push(`${"  ".repeat(depth)}- ${node.data.label}`);
    edges.filter((edge) => edge.source === id).forEach((edge) => walk(edge.target, depth + 1));
  }
  if (root) walk(root.id, 0);
  return lines.join("\n");
}
