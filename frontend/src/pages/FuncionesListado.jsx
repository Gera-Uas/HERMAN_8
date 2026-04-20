import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cog, Search } from "lucide-react";
import { entities } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import CatalogTable from "@/components/shared/CatalogTable";

export default function FuncionesListado() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: funciones = [], isLoading } = useQuery({
    queryKey: ['funciones'],
    queryFn: () => entities.Funcion.list('-created_date')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.Funcion.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funciones'] });
    }
  });

  const handleNew = () => {
    navigate(createPageUrl("FuncionDetalle"));
  };

  const handleView = (funcion) => {
    navigate(createPageUrl(`FuncionDetalle?id=${funcion.id}`));
  };

  const handleDelete = (funcion) => {
    if (confirm(`¿Está seguro de eliminar la función "${funcion.nombre}"?`)) {
      deleteMutation.mutate(funcion.id);
    }
  };

  const filteredData = funciones.filter(item => {
    const matchesSearch = 
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { 
      key: "nombre", 
      label: "Nombre",
      render: (value) => <span className="font-medium text-slate-800">{value}</span>
    },
    { key: "tipo", label: "Tipo", type: "badge" },
    { 
      key: "modulo", 
      label: "Módulo",
      render: (value) => <span className="text-slate-600">{value || "-"}</span>
    },
    { key: "prioridad", label: "Prioridad", type: "badge" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Funciones del Sistema"
        description="Gestiona las funciones y comportamientos del sistema"
        icon={Cog}
        onNew={handleNew}
      />
      
      <div className="p-8">
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Cargando...</p>
          </div>
        ) : (
          <CatalogTable
            data={filteredData}
            columns={columns}
            onView={handleView}
            onDelete={handleDelete}
            emptyMessage="No hay funciones registradas. Crea una nueva para comenzar."
          />
        )}
      </div>
    </div>
  );
}