import type { Edge, Node } from "reactflow";
import type { MindMapFile } from "../types/mindmap";

export function createNode(label: string, x: number, y: number): Node {
  return { id: crypto.randomUUID(), type: "default", position: { x, y }, data: { label, icon: "•", collapsed: false } };
}

export function defaultFile(): MindMapFile {
  const root = createNode("中心主题", 0, 0);
  const child = createNode("第一分支", 260, 0);
  const edge: Edge = { id: `${root.id}-${child.id}`, source: root.id, target: child.id, animated: true };
  return { id: crypto.randomUUID(), name: "未命名导图", updatedAt: new Date().toISOString(), nodes: [root, child], edges: [edge], theme: "business" };
}
