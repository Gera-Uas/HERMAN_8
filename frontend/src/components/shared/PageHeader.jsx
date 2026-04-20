import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";

export default function PageHeader({ 
  title, 
  description, 
  icon: Icon,
  onSave,
  onNew,
  saving = false
}) {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
            {description && (
              <p className="text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {onNew && (
            <Button 
              variant="outline" 
              onClick={onNew}
              className="border-slate-200 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo registro
            </Button>
          )}
          {onSave && (
            <Button 
              onClick={onSave}
              disabled={saving}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}