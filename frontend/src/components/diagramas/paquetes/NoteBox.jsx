import React from "react";
import { Trash2 } from "lucide-react";

export default function NoteBox({ note, isSelected, onClick, onDoubleClick, onDelete, onMouseDown }) {
  return (
    <div
      className={`absolute bg-yellow-200 border-2 border-yellow-400 rounded-lg p-3 shadow-sm transition-all cursor-pointer select-none group`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: isSelected ? 100 : 10,
        boxShadow: isSelected ? "0 0 0 3px rgba(234, 179, 8, 0.2)" : undefined,
        transform: "rotate(-3deg)",
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
    >
      <p className="text-xs text-yellow-900 break-words whitespace-pre-wrap">{note.text}</p>

      {/* Delete button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-all"
          title="Eliminar"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Resize handle */}
      <div
        data-resize="true"
        className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-600 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
        title="Redimensionar"
      />
    </div>
  );
}
