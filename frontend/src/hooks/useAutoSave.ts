import { useEffect } from "react";
import { saveFile } from "../storage/indexedDb";
import type { MindMapFile } from "../types/mindmap";

export function useAutoSave(file?: MindMapFile) {
  useEffect(() => {
    if (!file) return;
    const timer = window.setTimeout(() => saveFile(file), 500);
    return () => window.clearTimeout(timer);
  }, [file]);
}
