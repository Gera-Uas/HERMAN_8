import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useProjects } from "@/lib/ProjectContext";
import { useAuth } from "@/lib/AuthContext";
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
  LayoutGrid,
  Menu,
  LogOut
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
      { name: "Secuencia", icon: GitBranch, page: "DiagramasSecuencia" },
      { name: "Casos de uso", icon: Users, page: "DiagramasCasosUso" },
      { name: "Paquetes", icon: Package, page: "DiagramasPaquetes" },
      { name: "Clases", icon: LayoutGrid, page: "DiagramasClases" }
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
  const navigate = useNavigate();
  const { currentProject } = useProjects();
  const { logout, user } = useAuth();
  const [expandedItems, setExpandedItems] = useState([]);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Hide sidebar on ProjectsList page
  const isProjectsListPage = location.pathname === '/ProjectsList';

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

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
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      {!isProjectsListPage && (
        <aside className={cn(
          "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 fixed h-full flex flex-col transition-all duration-300 ease-in-out z-50",
          isSidebarMinimized ? "w-20" : "w-72"
        )}>
        {/* Logo/Header */}
        <button
          onClick={toggleSidebar}
          className="p-6 border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-200 flex items-center justify-between"
        >
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isSidebarMinimized ? "justify-center w-full" : ""
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            {!isSidebarMinimized && (
              <div className="overflow-hidden">
                <h1 className="text-white font-semibold text-lg tracking-tight whitespace-nowrap">DocuSDLC</h1>
                <p className="text-slate-400 text-xs whitespace-nowrap">Documentación de Software</p>
              </div>
            )}
          </div>
          {!isSidebarMinimized && (
            <Menu className="w-5 h-5 text-slate-400 flex-shrink-0" />
          )}
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto min-h-0 scrollbar-hidden-until-scroll">
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
                    title={isSidebarMinimized ? item.name : ""}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isSidebarMinimized && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {!isSidebarMinimized && (
                      expandedItems.includes(item.name) ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      )
                    )}
                  </button>
                  
                  {!isSidebarMinimized && expandedItems.includes(item.name) && (
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
                  title={isSidebarMinimized ? item.name : ""}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarMinimized && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!isSidebarMinimized && (
          <div className="p-4 border-t border-slate-700/50 shrink-0 space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {currentProject?.name?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{currentProject?.name || 'Mi Proyecto'}</p>
                <p className="text-xs text-slate-400">{currentProject?.status || 'v1.0.0'}</p>
              </div>
              <button
                onClick={() => navigate(createPageUrl('ProjectsList'))}
                className="group relative"
              >
                <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Gestionar proyectos
                </span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => logout(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 group"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Cerrar sesión</span>
              <span className="text-xs text-slate-500 ml-auto">{user?.email}</span>
            </button>
          </div>
        )}
        </aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out overflow-hidden",
        isProjectsListPage ? "ml-0" : (isSidebarMinimized ? "ml-20" : "ml-72")
      )}>
        {children}
      </main>
    </div>
  );
}