import React, { useState, useEffect } from "react";
import { Users, ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import UseCasePalette from "@/components/diagramas/casosUso/UseCasePalette";
import UseCaseCanvas from "@/components/diagramas/casosUso/UseCaseCanvas";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "usecase_diagrams";

export default function DiagramaCasosUso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actors, setActors] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [systemBoundary, setSystemBoundary] = useState({ x: 200, y: 100, width: 400, height: 300 });
  const [diagramName, setDiagramName] = useState("Diagrama sin guardar");
  const [isLoading, setIsLoading] = useState(!!id);

  // Load diagram from localStorage if ID is provided
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const diagrams = JSON.parse(saved);
          const diagram = diagrams.find(d => d.id === id);
          if (diagram) {
            setActors(diagram.actors || []);
            setUseCases(diagram.useCases || []);
            setAssociations(diagram.associations || []);
            setSystemBoundary(diagram.systemBoundary || { x: 200, y: 100, width: 400, height: 300 });
            setDiagramName(diagram.name);
          }
        } catch (e) {
          console.error("Error loading diagram:", e);
        }
      }
      setIsLoading(false);
    } else {
      // Default state for new diagram
      setActors([
        { id: "a1", type: "actor", name: "Usuario", description: "Usuario del sistema", x: 50, y: 150 },
        { id: "a2", type: "actor", name: "Administrador", description: "Administrador del sistema", x: 600, y: 150 },
      ]);
      setUseCases([
        { id: "uc1", type: "usecase", name: "Iniciar sesión", description: "El usuario inicia sesión en el sistema", x: 250, y: 100, width: 120, height: 80 },
        { id: "uc2", type: "usecase", name: "Gestionar datos", description: "Administración de datos del sistema", x: 250, y: 220, width: 120, height: 80 },
      ]);
      setAssociations([]);
      setIsLoading(false);
    }
  }, [id]);

  // Auto-save to localStorage
  useEffect(() => {
    if (id && !isLoading) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const diagrams = saved ? JSON.parse(saved) : [];
      const index = diagrams.findIndex(d => d.id === id);
      
      const updatedDiagram = {
        id,
        name: diagramName,
        actors,
        useCases,
        associations,
        systemBoundary,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        diagrams[index] = { ...diagrams[index], ...updatedDiagram };
      } else {
        diagrams.push(updatedDiagram);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    }
  }, [id, actors, useCases, associations, systemBoundary, diagramName, isLoading]);

  const handleBack = () => {
    navigate("/DiagramasCasosUso");
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Cargando diagrama...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title={diagramName}
        description="Editor visual UML — arrastra elementos para construir tu diagrama"
        icon={Users}
      >
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </Button>
      </PageHeader>
      <div className="flex flex-1 min-h-0 overflow-hidden overflow-x-hidden">
        <UseCasePalette />
        <UseCaseCanvas
          actors={actors}
          setActors={setActors}
          useCases={useCases}
          setUseCases={setUseCases}
          associations={associations}
          setAssociations={setAssociations}
        />
      </div>
    </div>
  );
}