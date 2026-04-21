import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function DiagramCreateEditModal({ type, diagram, onSave, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (diagram) {
      setForm({
        name: diagram.name || "",
        description: diagram.description || "",
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [diagram]);

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("El nombre del diagrama es requerido");
      return;
    }
    onSave(form);
  };

  const typeLabel = type === "sequence" ? "Diagrama de Secuencia" : "Diagrama de Casos de Uso";
  const title = diagram ? `Editar ${typeLabel}` : `Crear ${typeLabel}`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h3 className="font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre del diagrama *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder={`Ej: Mi ${typeLabel.toLowerCase()}`}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Descripción (opcional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe el propósito de este diagrama..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {diagram ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </div>
    </div>
  );
}
