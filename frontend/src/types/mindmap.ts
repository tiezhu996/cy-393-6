import type { Edge, Node } from "reactflow";

export interface MindMapFile {
  id: string;
  name: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
  theme: string;
}
