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

  const { data: modulos = [] } = useQuery({
    queryKey: ['modulos'],
    queryFn: () => entities.Modulo.list()
  });

  const { data: stakeholders = [] } = useQuery({
    queryKey: ['stakeholders'],
    queryFn: () => entities.Stakeholder.list()
  });

  const { data: analisisDocumentos = [] } = useQuery({
    queryKey: ['analisis-documentos'],
    queryFn: () => entities.AnalisisDocumento.list()
  });

  const { data: encuestas = [] } = useQuery({
    queryKey: ['encuestas'],
    queryFn: () => entities.Encuesta.list()
  });

  const { data: entrevistas = [] } = useQuery({
    queryKey: ['entrevistas'],
    queryFn: () => entities.Entrevista.list()
  });

  const { data: focusGroups = [] } = useQuery({
    queryKey: ['focus-groups'],
    queryFn: () => entities.FocusGroup.list()
  });

  const { data: historiasUsuario = [] } = useQuery({
    queryKey: ['historias-usuario'],
    queryFn: () => entities.HistoriaUsuario.list()
  });

  const { data: seguimientosTransaccionales = [] } = useQuery({
    queryKey: ['seguimientos-transaccionales'],
    queryFn: () => entities.SeguimientoTransaccional.list()
  });

  const { data: diagramasBackend = [] } = useQuery({
    queryKey: ['diagramas'],
    queryFn: () => entities.Diagrama.list()
  });

  const readLegacyDiagrams = (storageKey, type, editorPath) => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);
      return parsed
        .filter((diagram) => diagram.funcionId && diagram.funcionId === funcionId)
        .map((diagram) => ({
          ...diagram,
          tipo: type,
          editorPath,
          source: 'localStorage'
        }));
    } catch {
      return [];
    }
  };

  const linkedStakeholder = stakeholders.find((stakeholder) => stakeholder.id === funcion?.responsableId);

  const linkedArtifacts = [
    {
      key: 'AnalisisDocumento',
      label: 'Análisis de documentos',
      items: analisisDocumentos.filter((item) => item.funcionIds?.includes(funcionId)),
      getTitle: (item) => item.nombreDocumento,
      getDescription: (item) => item.proposito || item.fuente || 'Sin propósito',
      getTag: (item) => item.tipoDocumento || 'documento',
      detailRoute: (id) => createPageUrl(`AnalisisDocumentosDetalle?id=${id}`)
    },
    {
      key: 'Encuesta',
      label: 'Encuestas',
      items: encuestas.filter((item) => item.funcionIds?.includes(funcionId)),
      getTitle: (item) => item.titulo,
      getDescription: (item) => item.descripcion || 'Sin descripción',
      getTag: () => 'encuesta',
      detailRoute: (id) => createPageUrl(`EncuestaDetalle?id=${id}`)
    },
    {
      key: 'Entrevista',
      label: 'Entrevistas',
      items: entrevistas.filter((item) => item.funcionIds?.includes(funcionId)),
      getTitle: (item) => item.titulo,
      getDescription: (item) => item.resumen || item.descripcion || 'Sin resumen',
      getTag: (item) => item.tipoEntrevista || 'entrevista',
      detailRoute: (id) => createPageUrl(`EntrevistasDetalle?id=${id}`)
    },
    {
      key: 'FocusGroup',
      label: 'Focus Group',
      items: focusGroups.filter((item) => item.funcionIds?.includes(funcionId)),
      getTitle: (item) => item.titulo,
      getDescription: (item) => item.resultados || item.descripcion || 'Sin resultados',
      getTag: () => 'focus group',
      detailRoute: (id) => createPageUrl(`FocusGroupDetalle?id=${id}`)
    },
    {
      key: 'HistoriaUsuario',
      label: 'Historias de usuario',
      items: historiasUsuario.filter((item) => item.funcionIds?.includes(funcionId)),
      getTitle: (item) => item.titulo,
      getDescription: (item) => item.descripcion || 'Sin descripción',
      getTag: (item) => item.prioridad || 'historia',
      detailRoute: (id) => createPageUrl(`HistoriaUsuarioDetalle?id=${id}`)
    },
    {
      key: 'SeguimientoTransaccional',
      label: 'Seguimientos transaccionales',
      items: seguimientosTransaccionales.filter((item) => item.funcionIds?.includes(funcionId)),
      getTitle: (item) => item.titulo,
      getDescription: (item) => item.descripcion || 'Sin descripción',
      getTag: () => 'seguimiento',
      detailRoute: (id) => createPageUrl(`SeguimientoTransaccionalDetalle?id=${id}`)
    }
  ];

  const linkedBackendDiagrams = diagramasBackend.filter((diagram) => diagram.funcionId && diagram.funcionId === funcionId);
  const legacyDiagrams = [
    ...readLegacyDiagrams('sequence_diagrams', 'sequence', '/diagrama-secuencia-editor'),
    ...readLegacyDiagrams('usecase_diagrams', 'usecase', '/diagrama-casos-uso-editor'),
    ...readLegacyDiagrams('class_diagrams', 'class', '/diagrama-clases-editor'),
    ...readLegacyDiagrams('package_diagrams', 'package', '/diagrama-paquetes-editor')
  ];

  const diagramsById = new Map();
  [...linkedBackendDiagrams, ...legacyDiagrams].forEach((diagram) => {
    if (!diagramsById.has(diagram.id)) {
      diagramsById.set(diagram.id, diagram);
    }
  });
  const linkedDiagrams = Array.from(diagramsById.values());

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
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title={isEditing ? "Editar Función" : "Nueva Función"}
        description="Información de la función del sistema"
        icon={Cog}
        onSave={handleSave}
        saving={saving}
      />
      
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl w-full mx-auto space-y-6">
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
                <Select value={formData.modulo} onValueChange={(v) => handleInputChange("modulo", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar un módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modulos.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500">No hay módulos disponibles</div>
                    ) : (
                      modulos.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </FormCard>

          <FormCard title="Stakeholder vinculado" description="Stakeholder responsable de esta función">
            {!isEditing ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                Guarda la función primero para ver el stakeholder vinculado.
              </div>
            ) : !linkedStakeholder ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                No hay stakeholder vinculado a esta función.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-medium text-slate-800 truncate">{linkedStakeholder.nombre}</p>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                      {linkedStakeholder.rol || 'stakeholder'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{linkedStakeholder.departamento || linkedStakeholder.contacto || 'Sin información adicional'}</p>
                </div>
              </div>
            )}
          </FormCard>

          <FormCard title="Artefactos vinculados" description="Se obtienen desde el backend y se relacionan con esta función">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{linkedArtifacts.reduce((total, group) => total + group.items.length, 0)} elementos</span>
              </div>

              <div className="space-y-4">
                {linkedArtifacts.map((group) => (
                  <div key={group.key} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-slate-700">{group.label}</h5>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{group.items.length}</span>
                    </div>

                    {group.items.length === 0 ? (
                      <p className="text-sm text-slate-500">No hay registros vinculados para esta función.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => window.open(group.detailRoute(item.id), '_blank')}
                            className="text-left rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="font-medium text-slate-800 truncate">{group.getTitle(item)}</p>
                              <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                                {group.getTag(item)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{group.getDescription(item)}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FormCard>

          <FormCard title="Diagramas vinculados" description="Se leen desde backend y, para registros antiguos, desde el almacenamiento local">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{linkedDiagrams.length} elementos</span>
              </div>

              {linkedDiagrams.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                  Todavía no hay diagramas asociados a esta función.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {linkedDiagrams.map((diagram) => {
                    const editorPath = diagram.editorPath || (
                      diagram.tipo === 'sequence'
                        ? `/diagrama-secuencia-editor/${diagram.id}`
                        : diagram.tipo === 'usecase'
                          ? `/diagrama-casos-uso-editor/${diagram.id}`
                          : diagram.tipo === 'class'
                            ? `/diagrama-clases-editor/${diagram.id}`
                            : `/diagrama-paquetes-editor/${diagram.id}`
                    );

                    return (
                      <button
                        key={diagram.id}
                        type="button"
                        onClick={() => window.open(editorPath, '_blank')}
                        className="text-left rounded-xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="font-medium text-slate-800 truncate">{diagram.name}</p>
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                            {diagram.tipo || 'diagrama'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{diagram.description || 'Sin descripción'}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  );
}