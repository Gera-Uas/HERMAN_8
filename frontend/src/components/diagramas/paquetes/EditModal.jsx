import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditModal({ target, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (target?.item) {
      setFormData({ ...target.item });
    }
  }, [target?.item]);

  if (!target) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle>
            {target.type === "element" && "Editar elemento"}
            {target.type === "relationship" && "Editar relación"}
            {target.type === "note" && "Editar nota"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {target.type === "element" && (
            <>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nombre del elemento"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Descripción opcional"
                />
              </div>
            </>
          )}

          {target.type === "relationship" && (
            <>
              <div>
                <Label htmlFor="label">Etiqueta</Label>
                <Input
                  id="label"
                  value={formData.label || ""}
                  onChange={(e) => handleChange("label", e.target.value)}
                  placeholder="Etiqueta de la relación"
                />
              </div>
            </>
          )}

          {target.type === "note" && (
            <>
              <div>
                <Label htmlFor="text">Texto</Label>
                <textarea
                  id="text"
                  value={formData.text || ""}
                  onChange={(e) => handleChange("text", e.target.value)}
                  placeholder="Escribe tu nota aquí..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
