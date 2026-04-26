import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ClipboardList, 
  FileText, 
  Layers, 
  Code2, 
  TestTube, 
  Rocket,
  Users,
  FileSearch,
  Activity,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  Settings,
  UserCog,
  Cog,
  GitBranch,
  Package,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const phases = [
  {
    name: "Gestión del Proyecto",
    description: "Organización, seguimiento y control de los roles del proyecto",
    icon: Settings,
    color: "from-slate-700 to-slate-900",
    shadowColor: "shadow-slate-500/25",
    items: [
      { name: "Módulos", icon: Package, page: "ModulosListado" },
      { name: "Funciones", icon: Cog, page: "FuncionesListado" },
      { name: "Stakeholders", icon: UserCog, page: "StakeholdersListado" }
    ]
  },
  {
    name: "Recolección de datos",
    description: "Técnicas y herramientas para capturar información del dominio",
    icon: ClipboardList,
    color: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/25",
    items: [
      { name: "Entrevistas", icon: Users, page: "EntrevistasListado" },
      { name: "Encuestas", icon: ClipboardCheck, page: "EncuestasListado" },
      { name: "Focus Group", icon: MessageSquare, page: "FocusGroupListado" },
      { name: "Historias de Usuario", icon: BookOpen, page: "HistoriasUsuarioListado" },
      { name: "Análisis de documentos", icon: FileSearch, page: "AnalisisDocumentosListado" },
      { name: "Seguimiento transaccional", icon: Activity, page: "SeguimientoTransaccionalListado" }
    ]
  },
  {
    name: "Diagramas",
    description: "Modelado visual de procesos, comportamiento y estructura",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
    items: [
      { name: "Secuencia", icon: GitBranch, page: "DiagramasSecuencia" },
      { name: "Casos de uso", icon: Users, page: "DiagramasCasosUso" },
      { name: "Paquetes", icon: Package, page: "DiagramasPaquetes" },
      { name: "Clases", icon: LayoutGrid, page: "DiagramasClases" }
    ]
  },
  {
    name: "Requerimientos",
    description: "Especificación de requisitos funcionales y no funcionales",
    icon: FileText,
    color: "from-blue-500 to-cyan-600",
    shadowColor: "shadow-blue-500/25",
    page: "Requerimientos"
  },
  {
    name: "Diseño",
    description: "Arquitectura, diagramas y modelos del sistema",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
    page: "Diseno"
  },
  {
    name: "Desarrollo",
    description: "Implementación y documentación del código fuente",
    icon: Code2,
    color: "from-orange-500 to-amber-600",
    shadowColor: "shadow-orange-500/25",
    page: "Desarrollo"
  },
  {
    name: "Pruebas",
    description: "Casos de prueba y resultados de validación",
    icon: TestTube,
    color: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/25",
    page: "Pruebas"
  },
  {
    name: "Despliegue",
    description: "Configuración y documentación de la puesta en producción",
    icon: Rocket,
    color: "from-indigo-500 to-blue-600",
    shadowColor: "shadow-indigo-500/25",
    page: "Despliegue"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      {/* Hero Section */}
      <div className="px-8 py-12 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Sistema de Documentación SDLC</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Documenta cada fase del
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> ciclo de desarrollo</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Captura y organiza los artefactos generados durante las distintas fases del desarrollo de software de manera estructurada y profesional.
          </p>
        </div>
      </div>

      {/* Phases Grid */}
      <div className="p-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <Card 
              key={phase.name}
              className="group border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${phase.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <phase.icon className="w-6 h-6 text-white" />
                    </div>
                    {!phase.items && (
                      <Link 
                        to={createPageUrl(phase.page)}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </Link>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">{phase.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{phase.description}</p>
                </div>

                {/* Sub-items */}
                {phase.items ? (
                  <div className="p-4 space-y-2">
                    {phase.items.map((item) => (
                      <Link
                        key={item.name}
                        to={createPageUrl(item.page)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className={`w-9 h-9 bg-gradient-to-r ${phase.color} rounded-lg flex items-center justify-center shadow-md ${phase.shadowColor}`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-slate-700">{item.name}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-indigo-500 group-hover/item:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <Link
                      to={createPageUrl(phase.page)}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-600"
                    >
                      Acceder a la sección
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}