import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Layers,
  Code2,
  TestTube,
  Rocket,
  Settings,
  ClipboardList,
  Users,
  FileSearch,
  Activity,
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  UserCog,
  Cog,
  GitBranch,
  Package,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    page: "Home"
  },
  {
    name: "Recolección de datos",
    icon: ClipboardList,
    children: [
      { name: "Entrevistas", icon: Users, page: "EntrevistasListado" },
      { name: "Encuestas", icon: ClipboardCheck, page: "EncuestasListado" },
      { name: "Focus Group", icon: MessageSquare, page: "FocusGroupListado" },
      { name: "Historias de Usuario", icon: BookOpen, page: "HistoriasUsuarioListado" },
      { name: "Análisis de documentos", icon: FileSearch, page: "AnalisisDocumentosListado" },
      { name: "Seguimiento transaccional", icon: Activity, page: "SeguimientoTransaccionalListado" }
    ]
  },
  {
    name: "Gestión del Proyecto",
    icon: Settings,
    children: [
      { name: "Stakeholders", icon: UserCog, page: "StakeholdersListado" },
      { name: "Funciones", icon: Cog, page: "FuncionesListado" }
    ]
  },
  {
    name: "Requerimientos",
    icon: FileText,
    page: "Requerimientos"
  },
  {
    name: "Diagramas",
    icon: Layers,
    children: [
      { name: "Secuencia", icon: GitBranch, page: "DiagramaSecuencia" },
      { name: "Casos de uso", icon: Users, page: "DiagramaCasosUso" },
      { name: "Paquetes", icon: Package, page: "DiagramaPaquetes" },
      { name: "Clases", icon: LayoutGrid, page: "DiagramaClases" }
    ]
  },
  {
    name: "Desarrollo",
    icon: Code2,
    page: "Desarrollo"
  },
  {
    name: "Pruebas",
    icon: TestTube,
    page: "Pruebas"
  },
  {
    name: "Despliegue",
    icon: Rocket,
    page: "Despliegue"
  }
];

export default function Layout({ children }) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(["Recolección de datos"]);

  const toggleExpand = (name) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (page) => {
    const currentPath = location.pathname;
    return currentPath === createPageUrl(page);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg tracking-tight">DocuSDLC</h1>
              <p className="text-slate-400 text-xs">Documentación de Software</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto min-h-0">
          {navigationItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      expandedItems.includes(item.name)
                        ? "bg-slate-700/50 text-white"
                        : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {expandedItems.includes(item.name) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedItems.includes(item.name) && (
                    <div className="mt-1 ml-4 pl-4 border-l border-slate-700/50 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={createPageUrl(child.page)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
                            isActive(child.page)
                              ? "bg-indigo-500/20 text-indigo-400 font-medium"
                              : "text-slate-400 hover:bg-slate-700/30 hover:text-white"
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={createPageUrl(item.page)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.page)
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
              P
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">Mi Proyecto</p>
              <p className="text-xs text-slate-400">v1.0.0</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}