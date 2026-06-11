import { useMindMapStore } from "../../stores/mindMapStore";
import { Button } from "../common/Button";

export function FileSidebar() {
  const store = useMindMapStore();
  return <aside className="w-72 border-r bg-slate-50 p-3">
    <div className="mb-3 flex items-center justify-between"><strong>导图文件</strong><Button onClick={store.createFile}>新建</Button></div>
    <div className="space-y-2">{store.files.map((file) => <button className={`block w-full rounded-md p-2 text-left ${file.id === store.activeId ? "bg-blue-100" : "bg-white"}`} key={file.id} onClick={() => store.selectFile(file.id)}>
      <span className="block font-medium">{file.name}</span><span className="text-xs text-slate-500">{new Date(file.updatedAt).toLocaleString()}</span>
    </button>)}</div>
  </aside>;
}
