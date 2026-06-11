import type { NodeProps } from "reactflow";

export function MindNode({ data, selected }: NodeProps) {
  return <div className={`rounded-lg border px-4 py-2 shadow-sm ${selected ? "ring-2 ring-blue-500" : ""}`} style={{ background: data.bg, color: data.color }}>
    <span className="mr-2">{data.icon}</span>{data.label}
  </div>;
}
