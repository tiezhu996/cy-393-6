import { produce } from "immer";
import { create } from "zustand";
import type { Edge, Node } from "reactflow";
import { deleteFile, loadFiles, saveFile } from "../storage/indexedDb";
import type { MindMapFile } from "../types/mindmap";
import { createNode, defaultFile } from "../utils/factory";
import { cloneSubtree, extractSubtree, subtreeIds, type SubtreeData } from "../utils/tree";

interface MindMapState {
  files: MindMapFile[];
  activeId: string;
  selectedId?: string;
  clipboard: SubtreeData | null;
  history: MindMapFile[];
  future: MindMapFile[];
  hydrate: () => Promise<void>;
  active: () => MindMapFile;
  selectFile: (id: string) => void;
  createFile: () => void;
  renameFile: (id: string, name: string) => void;
  removeFile: (id: string) => void;
  setNodesEdges: (nodes: Node[], edges: Edge[]) => void;
  addChild: () => void;
  addSibling: () => void;
  removeSelected: () => void;
  setTheme: (theme: string) => void;
  selectNode: (id?: string) => void;
  copySelected: () => void;
  pasteToSelected: () => void;
  undo: () => void;
  redo: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  files: [],
  activeId: "",
  selectedId: undefined,
  clipboard: null,
  history: [],
  future: [],
  hydrate: async () => {
    const saved = await loadFiles();
    const files = saved.length ? saved : [defaultFile()];
    files.forEach(saveFile);
    set({ files, activeId: files[0].id });
  },
  active: () => get().files.find((file) => file.id === get().activeId) ?? get().files[0],
  selectFile: (id) => set({ activeId: id, selectedId: undefined }),
  createFile: () => {
    const file = defaultFile();
    saveFile(file);
    set({ files: [file, ...get().files], activeId: file.id });
  },
  renameFile: (id, name) => mutateFile(set, get, id, (file) => { file.name = name; }),
  removeFile: (id) => { deleteFile(id); const files = get().files.filter((f) => f.id !== id); set({ files, activeId: files[0]?.id ?? "" }); },
  setNodesEdges: (nodes, edges) => mutateActive(set, get, (file) => { file.nodes = nodes; file.edges = edges; }),
  addChild: () => {
    const active = get().active(); const selected = active.nodes.find((n) => n.id === get().selectedId) ?? active.nodes[0]; if (!selected) return;
    const child = createNode("新子节点", selected.position.x + 240, selected.position.y + 90);
    mutateActive(set, get, (file) => { file.nodes.push(child); file.edges.push({ id: `${selected.id}-${child.id}`, source: selected.id, target: child.id }); });
  },
  addSibling: () => {
    const active = get().active(); const selected = active.nodes.find((n) => n.id === get().selectedId); if (!selected) return;
    const parent = active.edges.find((e) => e.target === selected.id)?.source; if (!parent) return get().addChild();
    const node = createNode("新同级节点", selected.position.x, selected.position.y + 120);
    mutateActive(set, get, (file) => { file.nodes.push(node); file.edges.push({ id: `${parent}-${node.id}`, source: parent, target: node.id }); });
  },
  removeSelected: () => {
    const id = get().selectedId; if (!id) return;
    const ids = subtreeIds(id, get().active().edges);
    mutateActive(set, get, (file) => { file.nodes = file.nodes.filter((n) => !ids.includes(n.id)); file.edges = file.edges.filter((e) => !ids.includes(e.source) && !ids.includes(e.target)); });
  },
  setTheme: (theme) => mutateActive(set, get, (file) => { file.theme = theme; }),
  selectNode: (id) => set({ selectedId: id }),
  copySelected: () => {
    const id = get().selectedId;
    const active = get().active();
    if (!id || !active) return;
    const subtree = extractSubtree(id, active.nodes, active.edges);
    set({ clipboard: subtree });
  },
  pasteToSelected: () => {
    const clipboard = get().clipboard;
    const selectedId = get().selectedId;
    const active = get().active();
    if (!clipboard || !active || !selectedId) return;
    const parentNode = active.nodes.find((node) => node.id === selectedId);
    if (!parentNode) return;
    const rootClip = clipboard.nodes.find((node) => node.id === clipboard.rootId);
    if (!rootClip) return;
    const offsetX = parentNode.position.x + 240 - rootClip.position.x;
    const offsetY = parentNode.position.y - rootClip.position.y + 40;
    const cloned = cloneSubtree(clipboard, offsetX, offsetY);
    const connectEdge: Edge = {
      id: `${selectedId}-${cloned.rootId}`,
      source: selectedId,
      target: cloned.rootId,
      animated: true
    };
    mutateActive(set, get, (file) => {
      file.nodes.push(...cloned.nodes);
      file.edges.push(...cloned.edges, connectEdge);
    });
  },
  undo: () => { const history = get().history; const prev = history[history.length - 1]; if (!prev) return; set({ future: [get().active(), ...get().future], history: history.slice(0, -1), files: get().files.map((f) => f.id === prev.id ? prev : f) }); },
  redo: () => { const next = get().future[0]; if (!next) return; set({ history: [...get().history, get().active()], future: get().future.slice(1), files: get().files.map((f) => f.id === next.id ? next : f) }); }
}));

function mutateActive(set: any, get: any, recipe: (file: MindMapFile) => void) {
  const active = get().active();
  mutateFile(set, get, active.id, recipe);
}

function mutateFile(set: any, get: any, id: string, recipe: (file: MindMapFile) => void) {
  const previous = get().active();
  const files = produce(get().files, (draft: MindMapFile[]) => {
    const file = draft.find((item) => item.id === id);
    if (!file) return;
    recipe(file);
    file.updatedAt = new Date().toISOString();
  });
  const saved = files.find((item) => item.id === id);
  if (saved) saveFile(saved);
  set({ files, history: [...get().history, previous], future: [] });
}
