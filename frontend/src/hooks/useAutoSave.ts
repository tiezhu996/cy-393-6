import { useEffect, useRef } from "react";
import { saveFile } from "../storage/indexedDb";
import type { MindMapFile } from "../types/mindmap";

export function useAutoSave(file?: MindMapFile) {
  const lastSavedRef = useRef<string>("");
  useEffect(() => {
    if (!file) return;
    if (lastSavedRef.current === file.updatedAt) return;
    const timer = window.setTimeout(() => {
      saveFile(file).then(() => { lastSavedRef.current = file.updatedAt; });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [file]);
}
