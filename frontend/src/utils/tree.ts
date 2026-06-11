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
