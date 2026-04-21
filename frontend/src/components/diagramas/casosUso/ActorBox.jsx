import React from "react";
import { Trash2 } from "lucide-react";
import { User } from "lucide-react";

export default function ActorBox({ actor, isSelected, isDragging, onClick, onDoubleClick, onDelete, onMouseDown }) {
  return (
    <div
      className="absolute flex flex-col items-center cursor-grab active:cursor-grabbing"
      style={{ left: actor.x, top: actor.y, userSelect: "none" }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div
        className={`relative flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
          isSelected
            ? "ring-2 ring-indigo-500 shadow-lg"
            : "hover:shadow-md"
        }`}
        onClick={onClick}
        style={{
          background: isDragging ? "#f3f4f6" : "#ffffff",
          border: isSelected ? "2px solid #6366f1" : "2px solid #e2e8f0",
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <span className="text-xs font-semibold text-slate-700 text-center max-w-[80px] truncate">
          {actor.name}
        </span>

        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
