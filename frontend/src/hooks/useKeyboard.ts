import { useEffect } from "react";
import { SHORTCUTS } from "../constants/shortcuts";
import { useMindMapStore } from "../stores/mindMapStore";

export function useKeyboard() {
  const store = useMindMapStore();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === SHORTCUTS.ADD_CHILD) { e.preventDefault(); store.addChild(); }
      if (e.key === SHORTCUTS.ADD_SIBLING) store.addSibling();
      if (e.key === SHORTCUTS.DELETE) store.removeSelected();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === SHORTCUTS.UNDO) store.undo();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === SHORTCUTS.REDO) store.redo();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === SHORTCUTS.COPY) { e.preventDefault(); store.copySelected(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === SHORTCUTS.PASTE) { e.preventDefault(); store.pasteToSelected(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);
}
