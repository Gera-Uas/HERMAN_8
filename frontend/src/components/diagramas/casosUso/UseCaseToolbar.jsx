import React from "react";
import { X } from "lucide-react";

export default function UseCaseToolbar({ pendingAssociation, onCancelPending }) {
  if (!pendingAssociation) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <p className="text-sm font-medium text-blue-900">
          {!pendingAssociation.from
            ? "Selecciona un actor o un caso de uso como origen"
            : "Selecciona el segundo elemento (actor o caso de uso) como destino"}
        </p>
      </div>
      <button
        onClick={onCancelPending}
        className="p-1 hover:bg-blue-100 rounded transition-colors"
        title="Cancelar asociación"
      >
        <X className="w-4 h-4 text-blue-600" />
      </button>
    </div>
  );
}
