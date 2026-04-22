import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectCard({ project, onEdit, onDelete, onSelect }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En pausa':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer relative group"
    >
      {/* Menu Desplegable */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ⋯
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          {project.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
        {project.name}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
        {project.description || 'Sin descripción'}
      </p>

      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium px-3 py-1 rounded-full', getStatusColor(project.status))}>
          {project.status}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
