import React from "react";
import { Trash2, Pencil } from "lucide-react";

export default function NoteBox({ note, isSelected, onClick, onDoubleClick, onDelete, onMouseDown }) {
  return (
    <div
      className="absolute"
      style={{
        left: note.x,
        top: note.y,
        width: note.width || 160,
        minHeight: 60,
        zIndex: isSelected ? 4 : 3,
        cursor: "move",
        filter: isSelected ? "drop-shadow(0 0 6px rgba(250,204,21,0.6))" : "none",
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
    >
      <svg
        width={note.width || 160}
        height={note.height || 70}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <polygon
          points={`0,0 ${(note.width || 160) - 16},0 ${note.width || 160},16 ${note.width || 160},${note.height || 70} 0,${note.height || 70}`}
          fill="#fefce8"
          stroke="#fbbf24"
          strokeWidth={isSelected ? 2 : 1.5}
        />
        <polyline
          points={`${(note.width || 160) - 16},0 ${(note.width || 160) - 16},16 ${note.width || 160},16`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={isSelected ? 2 : 1.5}
        />
      </svg>

      <div
        style={{
          position: "relative",
          padding: "6px 20px 6px 8px",
          fontSize: 11,
          color: "#78350f",
          fontStyle: "italic",
          lineHeight: 1.4,
          maxWidth: "100%",
          wordBreak: "break-word",
        }}
      >
        {note.text || "Nota..."}
      </div>

      {/* Action buttons */}
      {isSelected && (
        <div style={{ position: "absolute", top: -10, right: -4, display: "flex", gap: 4, zIndex: 10 }}>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
            style={{ width: 22, height: 22, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <Pencil style={{ width: 10, height: 10, color: "#6366f1" }} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ width: 22, height: 22, background: "#fff", border: "1px solid #fecaca", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <Trash2 style={{ width: 10, height: 10, color: "#ef4444" }} />
          </button>
        </div>
      )}
    </div>
  );
}