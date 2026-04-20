import React from "react";
import { User, Monitor, Database, Globe, Server, Trash2, Pencil } from "lucide-react";

const ACTOR_WIDTH = 120;

const iconMap = {
  actor: User,
  system: Monitor,
  database: Database,
  external: Globe,
  service: Server,
};

const typeColors = {
  actor: "from-indigo-500 to-purple-600",
  system: "from-blue-500 to-cyan-600",
  database: "from-orange-500 to-amber-600",
  external: "from-slate-500 to-slate-700",
  service: "from-emerald-500 to-teal-600",
};

export default function ActorColumn({ actor, isSelected, isDragging, onClick, onDoubleClick, onMouseDown, onDelete }) {
  const Icon = iconMap[actor.type] || Monitor;
  const gradient = typeColors[actor.type] || typeColors.system;

  return (
    <div
      className="absolute"
      style={{ left: actor.x, top: 20, width: ACTOR_WIDTH, zIndex: 10, cursor: isDragging ? "grabbing" : "grab" }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
    >
      <div className={`relative flex flex-col items-center`}>
        {/* Box */}
        <div className={`
          w-full rounded-xl border-2 bg-white shadow-md transition-all
          ${isSelected ? "border-indigo-500 shadow-indigo-200 shadow-lg" : "border-slate-200 hover:border-indigo-300"}
        `}>
          <div className={`bg-gradient-to-br ${gradient} rounded-t-[10px] py-2 flex justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="px-2 py-1.5 text-center">
            <p className="text-xs font-semibold text-slate-700 truncate">{actor.name}</p>
          </div>
        </div>

        {/* Action buttons (visible on select) */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 flex gap-1">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
              className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              <Pencil className="w-3 h-3 text-indigo-500" />
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-6 h-6 bg-white border border-red-200 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}