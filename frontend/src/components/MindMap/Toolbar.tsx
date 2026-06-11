import { THEMES } from "../../constants/themes";
import { useMindMapStore } from "../../stores/mindMapStore";
import { exportJson, exportMarkdown, exportPng } from "../../utils/exporters";
import { Button } from "../common/Button";

export function Toolbar({ canvasId }: { canvasId: string }) {
  const store = useMindMapStore();
  const active = store.active();
  return <div className="flex flex-wrap items-center gap-2 border-b bg-white p-3">
    <Button onClick={store.addChild}>添加子节点</Button><Button onClick={store.addSibling}>添加同级</Button><Button onClick={store.removeSelected}>删除节点</Button>
    <select className="rounded-md border p-2" value={active?.theme} onChange={(e) => store.setTheme(e.target.value)}>{Object.entries(THEMES).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}</select>
    <Button onClick={() => exportJson(active)}>导出 JSON</Button><Button onClick={() => exportMarkdown(active)}>导出 Markdown</Button><Button onClick={() => exportPng(document.getElementById(canvasId)!, active.name)}>导出 PNG</Button>
  </div>;
}
