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

export default function RoleDetalle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const roleId = urlParams.get('id');
  const isEditing = !!roleId;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    nivel: "operativo"
  });
  const [saving, setSaving] = useState(false);

  const { data: role } = useQuery({
    queryKey: ['role', roleId],
    queryFn: async () => {
      const list = await entities.Role.list();
      return list.find(item => item.id === roleId);
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (role) {
      setFormData({
        nombre: role.nombre || "",
        descripcion: role.descripcion || "",
        nivel: role.nivel || "operativo"
      });
    }
  }, [role]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return await entities.Role.update(roleId, data);
      }
      return await entities.Role.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      navigate(createPageUrl("RolesListado"));
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
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title={isEditing ? "Editar Rol" : "Nuevo Rol"}
        description="Define un rol reutilizable para asignarlo a stakeholders"
        icon={Cog}
        onSave={handleSave}
        saving={saving}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl space-y-6">
          <FormCard title="Información básica" description="Datos principales del rol">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  placeholder="Ej: Product Owner"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  placeholder="Describa las responsabilidades del rol..."
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel</Label>
                <Select value={formData.nivel} onValueChange={(v) => handleInputChange("nivel", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estrategico">Estratégico</SelectItem>
                    <SelectItem value="tactico">Táctico</SelectItem>
                    <SelectItem value="operativo">Operativo</SelectItem>
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
