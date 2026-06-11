import { toPng } from "html-to-image";
import type { MindMapFile } from "../types/mindmap";
import { toMarkdown } from "./tree";

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  Object.assign(document.createElement("a"), { href: url, download: filename }).click();
  URL.revokeObjectURL(url);
}

export function exportJson(file: MindMapFile) { download(JSON.stringify(file, null, 2), `${file.name}.json`, "application/json"); }
export function exportMarkdown(file: MindMapFile) { download(toMarkdown(file.nodes, file.edges), `${file.name}.md`, "text/markdown"); }
export async function exportPng(element: HTMLElement, name: string) {
  const dataUrl = await toPng(element);
  Object.assign(document.createElement("a"), { href: dataUrl, download: `${name}.png` }).click();
}
