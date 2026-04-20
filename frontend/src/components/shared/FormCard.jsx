import React from "react";
import { cn } from "@/lib/utils";

export default function FormCard({ title, description, children, className }) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
      className
    )}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}