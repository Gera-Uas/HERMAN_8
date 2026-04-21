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
import { Plus, Trash2 } from "lucide-react";

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

  const handleAddAttribute = () => {
    const attrs = formData.attributes || [];
    setFormData(prev => ({
      ...prev,
      attributes: [...attrs, { name: "attr", type: "string", visibility: "+" }]
    }));
  };

  const handleRemoveAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateAttribute = (index, field, value) => {
    const attrs = [...(formData.attributes || [])];
    attrs[index] = { ...attrs[index], [field]: value };
    setFormData(prev => ({ ...prev, attributes: attrs }));
  };

  const handleAddMethod = () => {
    const methods = formData.methods || [];
    setFormData(prev => ({
      ...prev,
      methods: [...methods, { name: "method", visibility: "+" }]
    }));
  };

  const handleRemoveMethod = (index) => {
    setFormData(prev => ({
      ...prev,
      methods: prev.methods.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateMethod = (index, field, value) => {
    const methods = [...(formData.methods || [])];
    methods[index] = { ...methods[index], [field]: value };
    setFormData(prev => ({ ...prev, methods }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={!!target} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle>
            {target.type === "class" && "Editar clase"}
            {target.type === "relationship" && "Editar relación"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {target.type === "class" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nombre de la clase"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    value={formData.type || "class"}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="class">Clase</option>
                    <option value="interface">Interfaz</option>
                    <option value="abstract">Abstracta</option>
                    <option value="enum">Enumeración</option>
                  </select>
                </div>
              </div>

              {/* Atributos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Atributos</Label>
                  <Button
                    onClick={handleAddAttribute}
                    size="sm"
                    variant="outline"
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.attributes?.map((attr, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          placeholder="Nombre"
                          value={attr.name}
                          onChange={(e) => handleUpdateAttribute(i, "name", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          placeholder="Tipo"
                          value={attr.type}
                          onChange={(e) => handleUpdateAttribute(i, "type", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveAttribute(i)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métodos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Métodos</Label>
                  <Button
                    onClick={handleAddMethod}
                    size="sm"
                    variant="outline"
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.methods?.map((method, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          placeholder="Nombre del método"
                          value={method.name}
                          onChange={(e) => handleUpdateMethod(i, "name", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveMethod(i)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
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
