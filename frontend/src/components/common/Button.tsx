import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 ${props.className ?? ""}`} />;
}
