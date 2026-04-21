import React from "react";
import { Package, Code2, Box, Trash2 } from "lucide-react";

export default function PackageBox({ element, isSelected, onClick, onDoubleClick, onDelete, onMouseDown }) {
  const iconMap = {
    package: Package,
    interface: Code2,
    class: Box,
  };

  const colorMap = {
    package: { bg: "from-indigo-100 to-indigo-50", border: "border-indigo-300", icon: "text-indigo-600" },
    interface: { bg: "from-purple-100 to-purple-50", border: "border-purple-300", icon: "text-purple-600" },
    class: { bg: "from-blue-100 to-blue-50", border: "border-blue-300", icon: "text-blue-600" },
  };

  const Icon = iconMap[element.type] || Package;
  const colors = colorMap[element.type] || colorMap.package;

  return (
    <div
      className={`absolute bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-xl p-4 shadow-sm transition-all cursor-pointer select-none group`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: isSelected ? 100 : 10,
        boxShadow: isSelected ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : undefined,
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
    >
      {/* Header con icono y nombre */}
      <div className="flex items-start gap-2 mb-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 truncate">{element.name}</p>
          <p className="text-xs text-slate-500 capitalize">{element.type}</p>
        </div>
      </div>

      {/* Descripción */}
      {element.description && (
        <p className="text-xs text-slate-600 line-clamp-2 mb-2">{element.description}</p>
      )}

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
