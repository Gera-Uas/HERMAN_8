import React from "react";
import { Trash2 } from "lucide-react";

export default function UseCaseBox({ useCase, isSelected, isDragging, onClick, onDoubleClick, onDelete, onMouseDown }) {
  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ left: useCase.x, top: useCase.y, userSelect: "none" }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div
        className={`relative flex items-center justify-center transition-all ${
          isSelected
            ? "ring-2 ring-indigo-500 shadow-lg"
            : "hover:shadow-md"
        }`}
        onClick={onClick}
        style={{
          width: useCase.width || 120,
          height: useCase.height || 80,
          background: isDragging ? "#fef3f4" : "#ffffff",
          border: isSelected ? "2px solid #6366f1" : "2px solid #e2e8f0",
          borderRadius: "50%",
          textAlign: "center",
          padding: "8px",
        }}
      >
        <span className="text-xs font-semibold text-slate-700 line-clamp-3 px-2">
          {useCase.name}
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
