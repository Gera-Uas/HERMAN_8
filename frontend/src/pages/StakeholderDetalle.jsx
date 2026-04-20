import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
import { entities } from "@/api/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";

export default function StakeholderDetalle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const stakeholderId = urlParams.get('id');
  const isEditing = !!stakeholderId;

  const [formData, setFormData] = useState({
    nombre: "",
    rol: "",
    departamento: "",
    contacto: "",
    prioridad: "media",
    expectativas: "",
    influencia: ""
  });
  const [saving, setSaving] = useState(false);

  const { data: stakeholder } = useQuery({
    queryKey: ['stakeholder', stakeholderId],
    queryFn: async () => {
      const list = await entities.Stakeholder.list();
      return list.find(s => s.id === stakeholderId);
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        nombre: stakeholder.nombre || "",
        rol: stakeholder.rol || "",
        departamento: stakeholder.departamento || "",
        contacto: stakeholder.contacto || "",
        prioridad: stakeholder.prioridad || "media",
        expectativas: stakeholder.expectativas || "",
        influencia: stakeholder.influencia || ""
      });
    }
  }, [stakeholder]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return await entities.Stakeholder.update(stakeholderId, data);
      } else {
        return await entities.Stakeholder.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stakeholders'] });
      navigate(createPageUrl("StakeholdersListado"));
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
        title={isEditing ? "Editar Stakeholder" : "Nuevo Stakeholder"}
        description="Información del stakeholder del proyecto"
        icon={UserCog}
        onSave={handleSave}
        saving={saving}
      />
      
      <div className="p-8">
        <div className="max-w-4xl space-y-6">
          <FormCard title="Información básica" description="Datos principales del stakeholder">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input 
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Input 
                  placeholder="Ej: Product Owner, Analista de Negocio"
                  value={formData.rol}
                  onChange={(e) => handleInputChange("rol", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input 
                  placeholder="Ej: Ventas, TI, Operaciones"
                  value={formData.departamento}
                  onChange={(e) => handleInputChange("departamento", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto (Email)</Label>
                <Input 
                  type="email"
                  placeholder="email@example.com"
                  value={formData.contacto}
                  onChange={(e) => handleInputChange("contacto", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={formData.prioridad} onValueChange={(v) => handleInputChange("prioridad", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormCard>

          <FormCard title="Análisis del stakeholder" description="Expectativas e influencia en el proyecto">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expectativas">Expectativas</Label>
                <Textarea 
                  placeholder="Describa las expectativas del stakeholder respecto al proyecto..."
                  value={formData.expectativas}
                  onChange={(e) => handleInputChange("expectativas", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="influencia">Influencia</Label>
                <Textarea 
                  placeholder="Describa el nivel de influencia y poder de decisión del stakeholder..."
                  value={formData.influencia}
                  onChange={(e) => handleInputChange("influencia", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  );
}