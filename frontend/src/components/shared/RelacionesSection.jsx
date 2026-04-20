import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormCard from "./FormCard";
import MultiSelectBadge from "./MultiSelectBadge";

export default function RelacionesSection({ 
  stakeholders = [], 
  funciones = [], 
  selectedStakeholderIds = [], 
  selectedFuncionIds = [], 
  onStakeholderAdd,
  onStakeholderRemove,
  onFuncionAdd,
  onFuncionRemove
}) {
  return (
    <FormCard title="Relaciones" description="Stakeholders y funciones del sistema relacionadas">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="stakeholders">Stakeholders Relacionados</Label>
          <Select 
            onValueChange={(value) => {
              if (!selectedStakeholderIds.includes(value)) {
                onStakeholderAdd(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar stakeholder" />
            </SelectTrigger>
            <SelectContent>
              {stakeholders.map((sh) => (
                <SelectItem key={sh.id} value={sh.id}>
                  {sh.nombre} - {sh.rol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <MultiSelectBadge 
            items={stakeholders.filter(s => selectedStakeholderIds.includes(s.id))}
            onRemove={onStakeholderRemove}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="funciones">Funciones Relacionadas</Label>
          <Select 
            onValueChange={(value) => {
              if (!selectedFuncionIds.includes(value)) {
                onFuncionAdd(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar función" />
            </SelectTrigger>
            <SelectContent>
              {funciones.map((fn) => (
                <SelectItem key={fn.id} value={fn.id}>
                  {fn.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <MultiSelectBadge 
            items={funciones.filter(f => selectedFuncionIds.includes(f.id))}
            onRemove={onFuncionRemove}
          />
        </div>
      </div>
    </FormCard>
  );
}