import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
import { entities } from "@/api/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    funcionId: ""
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

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => entities.Role.list()
  });

  const { data: funciones = [] } = useQuery({
    queryKey: ['funciones'],
    queryFn: () => entities.Funcion.list()
  });

  useEffect(() => {
    if (stakeholder) {
      const funcionVinculada = funciones.find((funcion) => funcion.responsableId === stakeholderId);
      setFormData({
        nombre: stakeholder.nombre || "",
        rol: stakeholder.rol || "",
        departamento: stakeholder.departamento || "",
        contacto: stakeholder.contacto || "",
        funcionId: funcionVinculada?.id || stakeholder.funcionId || ""
      });
    }
  }, [stakeholder, funciones, stakeholderId]);

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
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        rol: formData.rol,
        departamento: formData.departamento,
        contacto: formData.contacto
      };

      const savedStakeholder = await saveMutation.mutateAsync(payload);
      const savedStakeholderId = isEditing ? stakeholderId : savedStakeholder?.id;

      if (savedStakeholderId) {
        const funcionAnterior = funciones.find((funcion) => funcion.responsableId === savedStakeholderId);

        if (funcionAnterior && funcionAnterior.id !== formData.funcionId) {
          await entities.Funcion.update(funcionAnterior.id, { ...funcionAnterior, responsableId: "" });
        }

        if (formData.funcionId) {
          const funcionSeleccionada = funciones.find((funcion) => funcion.id === formData.funcionId);
          if (funcionSeleccionada) {
            await entities.Funcion.update(funcionSeleccionada.id, {
              ...funcionSeleccionada,
              responsableId: savedStakeholderId
            });
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['funciones'] });
      navigate(createPageUrl("StakeholdersListado"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title={isEditing ? "Editar Stakeholder" : "Nuevo Stakeholder"}
        description="Información del stakeholder del proyecto"
        icon={UserCog}
        onSave={handleSave}
        saving={saving}
      />
      
      <div className="flex-1 overflow-y-auto p-8">
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
                <Select value={formData.rol} onValueChange={(v) => handleInputChange("rol", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.length === 0 ? (
                      <SelectItem value="__empty" disabled>
                        No hay roles disponibles
                      </SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.nombre}>
                          {role.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="funcionId">Función</Label>
                <Select
                  value={formData.funcionId || "__none"}
                  onValueChange={(v) => handleInputChange("funcionId", v === "__none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar una función" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">Sin función</SelectItem>
                    {funciones.length === 0 ? (
                      <SelectItem value="__empty" disabled>
                        No hay funciones disponibles
                      </SelectItem>
                    ) : (
                      funciones.map((funcion) => (
                        <SelectItem key={funcion.id} value={funcion.id}>
                          {funcion.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  );
}