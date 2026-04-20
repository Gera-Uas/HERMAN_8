import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function MultiSelectBadge({ items = [], onRemove }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <Badge 
          key={item.id} 
          variant="secondary" 
          className="bg-indigo-50 text-indigo-700 border-indigo-200 pr-1"
        >
          {item.nombre}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="ml-2 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}