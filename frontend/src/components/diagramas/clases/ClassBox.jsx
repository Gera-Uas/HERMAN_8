import React from "react";
import { Box, Database, Shield, File, Trash2 } from "lucide-react";

export default function ClassBox({ classItem, isSelected, onClick, onDoubleClick, onDelete, onMouseDown }) {
  const iconMap = {
    class: Box,
    interface: Shield,
    enum: File,
    abstract: Database,
  };

  const colorMap = {
    class: { bg: "from-indigo-100 to-indigo-50", border: "border-indigo-300", icon: "text-indigo-600", header: "bg-indigo-200" },
    interface: { bg: "from-purple-100 to-purple-50", border: "border-purple-300", icon: "text-purple-600", header: "bg-purple-200" },
    enum: { bg: "from-blue-100 to-blue-50", border: "border-blue-300", icon: "text-blue-600", header: "bg-blue-200" },
    abstract: { bg: "from-amber-100 to-amber-50", border: "border-amber-300", icon: "text-amber-600", header: "bg-amber-200" },
  };

  const Icon = iconMap[classItem.type] || Box;
  const colors = colorMap[classItem.type] || colorMap.class;

  return (
    <div
      className={`absolute bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-lg shadow-sm transition-all cursor-pointer select-none group overflow-hidden`}
      style={{
        left: classItem.x,
        top: classItem.y,
        width: classItem.width,
        height: classItem.height,
        zIndex: isSelected ? 100 : 10,
        boxShadow: isSelected ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : undefined,
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
    >
      {/* Header */}
      <div className={`${colors.header} px-3 py-2 flex items-center gap-2 border-b border-slate-300`}>
        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          <Icon className="w-3 h-3" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs text-slate-900 truncate">{classItem.name}</p>
        </div>
      </div>

      {/* Atributos */}
      <div className="flex-1 overflow-auto px-2 py-1 text-xs">
        {classItem.attributes && classItem.attributes.length > 0 ? (
          <>
            {classItem.attributes.map((attr, i) => (
              <p key={i} className="text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
                {attr.visibility || '+'} {attr.name}: {attr.type || '?'}
              </p>
            ))}
            <div className="border-t border-slate-300 my-1" />
          </>
        ) : (
          <p className="text-slate-500 italic">Sin atributos</p>
        )}
      </div>

      {/* Métodos */}
      <div className="flex-1 overflow-auto px-2 py-1 text-xs border-t border-slate-300">
        {classItem.methods && classItem.methods.length > 0 ? (
          classItem.methods.map((method, i) => (
            <p key={i} className="text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
              {method.visibility || '+'} {method.name}()
            </p>
          ))
        ) : (
          <p className="text-slate-500 italic">Sin métodos</p>
        )}
      </div>

      {/* Delete button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-all"
          title="Eliminar"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Resize handle */}
      <div
        data-resize="true"
        className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
        title="Redimensionar"
      />
    </div>
  );
}
