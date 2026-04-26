import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { entities } from "@/api/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import TemplateTabs from "@/components/shared/TemplateTabs";
import FormCard from "@/components/shared/FormCard";
import FileUploader from "@/components/shared/FileUploader";
import MultiSelectBadge from "@/components/shared/MultiSelectBadge";

export default function EntrevistasDetalle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const entrevistaId = urlParams.get('id');
  const isEditing = !!entrevistaId;

  const [activeTab, setActiveTab] = useState("informacion");
  const [formData, setFormData] = useState({
    tipoEntrevista: "",
    objetivo: "",
    fecha: "",
    entrevistador: "",
    entrevistado: "",
    area: "",
    duracion: "",
    consentimiento: false,
    estado: "borrador",
    stakeholderIds: [],
    funcionIds: []
  });
  const [audioFiles, setAudioFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [transcripcion, setTranscripcion] = useState("");
  const [conclusiones, setConclusiones] = useState({
    resumen: "",
    hallazgos: "",
    requisitos: "",
    observaciones: "",
    riesgos: ""
  });
  const [saving, setSaving] = useState(false);

  // Load stakeholders and funciones
  const { data: stakeholders = [] } = useQuery({
    queryKey: ['stakeholders'],
    queryFn: () => entities.Stakeholder.list()
  });

  const { data: funciones = [] } = useQuery({
    queryKey: ['funciones'],
    queryFn: () => entities.Funcion.list()
  });

  // Load data if editing
  const { data: entrevista } = useQuery({
    queryKey: ['entrevista', entrevistaId],
    queryFn: async () => {
      const list = await entities.Entrevista.list();
      return list.find(e => e.id === entrevistaId);
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (entrevista) {
      setFormData({
        tipoEntrevista: entrevista.tipoEntrevista || "",
        objetivo: entrevista.objetivo || entrevista.descripcion || "",
        fecha: entrevista.fecha || "",
        entrevistador: entrevista.entrevistador || "",
        entrevistado: entrevista.entrevistado || entrevista.titulo || "",
        area: entrevista.area || "",
        duracion: entrevista.duracion || "",
        consentimiento: entrevista.consentimiento || false,
        estado: entrevista.estado || "borrador",
        stakeholderIds: entrevista.stakeholderIds || (entrevista.stakeholderId ? [entrevista.stakeholderId] : []),
        funcionIds: entrevista.funcionIds || []
      });
      setTranscripcion(entrevista.transcripcion || "");
      setConclusiones({
        resumen: entrevista.resumen || "",
        hallazgos: entrevista.hallazgos || "",
        requisitos: entrevista.requisitos || "",
        observaciones: entrevista.observaciones || "",
        riesgos: entrevista.riesgos || ""
      });
    }
  }, [entrevista]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return await entities.Entrevista.update(entrevistaId, data);
      } else {
        return await entities.Entrevista.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      navigate(createPageUrl("EntrevistasListado"));
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConclusionChange = (field, value) => {
    setConclusiones(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const dataToSave = {
      ...formData,
      titulo: formData.entrevistado || formData.tipoEntrevista || "Entrevista",
      descripcion: formData.objetivo || "",
      stakeholderId: formData.stakeholderIds?.[0] || null,
      transcripcion,
      ...conclusiones
    };
    saveMutation.mutate(dataToSave);
    setSaving(false);
  };

  // Tab 1: Información estructurada
  const informacionContent = (
    <div className="space-y-6">
      <FormCard title="Datos de la entrevista" description="Información general sobre la sesión">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de entrevista</Label>
            <Select value={formData.tipoEntrevista} onValueChange={(v) => handleInputChange("tipoEntrevista", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estructurada">Estructurada</SelectItem>
                <SelectItem value="semiestructurada">Semiestructurada</SelectItem>
                <SelectItem value="no-estructurada">No estructurada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de realización</Label>
            <Input 
              type="date" 
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="objetivo">Objetivo de la entrevista</Label>
            <Textarea 
              placeholder="Describa el objetivo principal de esta entrevista..."
              value={formData.objetivo}
              onChange={(e) => handleInputChange("objetivo", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Participantes" description="Información sobre entrevistador y entrevistado">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="entrevistador">Entrevistador</Label>
            <Input 
              placeholder="Nombre del entrevistador"
              value={formData.entrevistador}
              onChange={(e) => handleInputChange("entrevistador", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entrevistado">Entrevistado (nombre o rol)</Label>
            <Input 
              placeholder="Nombre o rol del entrevistado"
              value={formData.entrevistado}
              onChange={(e) => handleInputChange("entrevistado", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área o stakeholder representado</Label>
            <Input 
              placeholder="Ej: Finanzas, Operaciones, TI..."
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracion">Duración estimada</Label>
            <Input 
              placeholder="Ej: 45 minutos"
              value={formData.duracion}
              onChange={(e) => handleInputChange("duracion", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={formData.estado} onValueChange={(v) => handleInputChange("estado", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="analizado">Analizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
              <Checkbox 
                id="consentimiento"
                checked={formData.consentimiento}
                onCheckedChange={(checked) => handleInputChange("consentimiento", checked)}
              />
              <Label htmlFor="consentimiento" className="text-sm cursor-pointer">
                El entrevistado ha dado su consentimiento para la grabación de audio/video
              </Label>
            </div>
          </div>
        </div>
      </FormCard>

      <FormCard title="Relaciones" description="Stakeholders y funciones del sistema relacionadas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="stakeholders">Stakeholders Relacionados</Label>
            <Select 
              onValueChange={(value) => {
                if (!formData.stakeholderIds.includes(value)) {
                  handleInputChange("stakeholderIds", [...formData.stakeholderIds, value]);
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
              items={stakeholders.filter(s => formData.stakeholderIds.includes(s.id))}
              onRemove={(id) => handleInputChange("stakeholderIds", formData.stakeholderIds.filter(sid => sid !== id))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funciones">Funciones Relacionadas</Label>
            <Select 
              onValueChange={(value) => {
                if (!formData.funcionIds.includes(value)) {
                  handleInputChange("funcionIds", [...formData.funcionIds, value]);
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
              items={funciones.filter(f => formData.funcionIds.includes(f.id))}
              onRemove={(id) => handleInputChange("funcionIds", formData.funcionIds.filter(fid => fid !== id))}
            />
          </div>
        </div>
      </FormCard>
    </div>
  );

  // Tab 2: Evidencia
  const evidenciaContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Archivos de audio" description="MP3, WAV">
          <FileUploader
            accept=".mp3,.wav"
            files={audioFiles}
            onFilesChange={setAudioFiles}
            title="Cargar audio"
            description="Arrastra archivos de audio aquí"
          />
        </FormCard>

        <FormCard title="Archivos de video" description="MP4">
          <FileUploader
            accept=".mp4"
            files={videoFiles}
            onFilesChange={setVideoFiles}
            title="Cargar video"
            description="Arrastra archivos de video aquí"
          />
        </FormCard>
      </div>

      <FormCard title="Transcripción" description="Opcional - Texto transcrito de la entrevista">
        <Textarea
          placeholder="Escriba o pegue aquí la transcripción de la entrevista..."
          value={transcripcion}
          onChange={(e) => setTranscripcion(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
        />
      </FormCard>
    </div>
  );

  // Tab 3: Conclusiones
  const conclusionesContent = (
    <div className="space-y-6">
      <FormCard title="Resumen de la entrevista" description="Síntesis de la información recopilada">
        <Textarea
          placeholder="Escriba un resumen ejecutivo de la entrevista..."
          value={conclusiones.resumen}
          onChange={(e) => handleConclusionChange("resumen", e.target.value)}
          className="min-h-[120px]"
        />
      </FormCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Hallazgos clave" description="Descubrimientos importantes">
          <Textarea
            placeholder="• Hallazgo 1&#10;• Hallazgo 2&#10;• Hallazgo 3"
            value={conclusiones.hallazgos}
            onChange={(e) => handleConclusionChange("hallazgos", e.target.value)}
            className="min-h-[150px]"
          />
        </FormCard>

        <FormCard title="Requisitos identificados" description="Requerimientos detectados">
          <Textarea
            placeholder="• REQ-001: Descripción&#10;• REQ-002: Descripción"
            value={conclusiones.requisitos}
            onChange={(e) => handleConclusionChange("requisitos", e.target.value)}
            className="min-h-[150px]"
          />
        </FormCard>

        <FormCard title="Observaciones" description="Notas adicionales relevantes">
          <Textarea
            placeholder="Observaciones sobre el proceso, ambiente, comunicación..."
            value={conclusiones.observaciones}
            onChange={(e) => handleConclusionChange("observaciones", e.target.value)}
            className="min-h-[150px]"
          />
        </FormCard>

        <FormCard title="Riesgos o conflictos detectados" description="Posibles problemas identificados">
          <Textarea
            placeholder="• Riesgo 1: Descripción e impacto&#10;• Conflicto 1: Partes involucradas"
            value={conclusiones.riesgos}
            onChange={(e) => handleConclusionChange("riesgos", e.target.value)}
            className="min-h-[150px]"
          />
        </FormCard>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title={isEditing ? "Editar entrevista" : "Nueva entrevista"}
        description="Documenta la entrevista realizada con stakeholders"
        icon={Users}
        onSave={handleSave}
        saving={saving}
      />
      
      <div className="flex-1 overflow-y-auto p-8">
        <TemplateTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          informacionContent={informacionContent}
          evidenciaContent={evidenciaContent}
          conclusionesContent={conclusionesContent}
        />
      </div>
    </div>
  );
}