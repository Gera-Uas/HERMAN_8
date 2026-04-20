import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cog } from "lucide-react";
import { entities } from "@/api/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";

export default function FuncionDetalle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const funcionId = urlParams.get('id');
  const isEditing = !!funcionId;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "funcional",
    modulo: "",
    prioridad: "media",
    dependencias: ""
  });
  const [saving, setSaving] = useState(false);

  const { data: funcion } = useQuery({
    queryKey: ['funcion', funcionId],
    queryFn: async () => {
      const list = await entities.Funcion.list();
      return list.find(f => f.id === funcionId);
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (funcion) {
      setFormData({
        nombre: funcion.nombre || "",
        descripcion: funcion.descripcion || "",
        tipo: funcion.tipo || "funcional",
        modulo: funcion.modulo || "",
        prioridad: funcion.prioridad || "media",
        dependencias: funcion.dependencias || ""
      });
    }
  }, [funcion]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return await entities.Funcion.update(funcionId, data);
      } else {
        return await entities.Funcion.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funciones'] });
      navigate(createPageUrl("FuncionesListado"));
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    saveMutation.mutate(formData);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title={isEditing ? "Editar Función" : "Nueva Función"}
        description="Información de la función del sistema"
        icon={Cog}
        onSave={handleSave}
        saving={saving}
      />
      
      <div className="p-8">
        <div className="max-w-4xl space-y-6">
          <FormCard title="Información básica" description="Datos principales de la función">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="nombre">Nombre de la función *</Label>
                <Input 
                  placeholder="Ej: Gestión de inventario"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea 
                  placeholder="Describa detalladamente la función del sistema..."
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(v) => handleInputChange("tipo", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcional">Funcional</SelectItem>
                    <SelectItem value="no_funcional">No Funcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modulo">Módulo</Label>
                <Input 
                  placeholder="Ej: Ventas, Compras, Reportes"
                  value={formData.modulo}
                  onChange={(e) => handleInputChange("modulo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={formData.prioridad} onValueChange={(v) => handleInputChange("prioridad", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critica">Crítica</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormCard>

          <FormCard title="Dependencias" description="Relaciones con otras funciones">
            <div className="space-y-2">
              <Label htmlFor="dependencias">Dependencias</Label>
              <Textarea 
                placeholder="Describa las dependencias con otras funciones o módulos del sistema..."
                value={formData.dependencias}
                onChange={(e) => handleInputChange("dependencias", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  );
}