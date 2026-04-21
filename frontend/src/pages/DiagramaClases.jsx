import React, { useState, useEffect } from "react";
import { LayoutGrid, ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "class_diagrams";

export default function DiagramaClases() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [classes, setClasses] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selected, setSelected] = useState(null);
  const [diagramName, setDiagramName] = useState("Diagrama de Clases");
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
            setClasses(diagram.classes || []);
            setRelationships(diagram.relationships || []);
            setDiagramName(diagram.name);
          }
        } catch (e) {
          console.error("Error loading diagram:", e);
        }
      }
      setIsLoading(false);
    } else {
      // Default state for new diagram
      setClasses([
        {
          id: "c1",
          name: "Clase 1",
          description: "",
          x: 100,
          y: 100,
          width: 150,
          height: 120,
          attributes: [],
          methods: [],
        },
      ]);
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
        classes,
        relationships,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        diagrams[index] = { ...diagrams[index], ...updatedDiagram };
      } else {
        diagrams.push(updatedDiagram);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    }
  }, [id, classes, relationships, diagramName, isLoading]);

  const handleBack = () => {
    navigate("/DiagramasClases");
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
        description="Editor visual UML — arrastra componentes al canvas para construir tu diagrama"
        icon={LayoutGrid}
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
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 bg-slate-100 flex items-center justify-center">
          <p className="text-slate-400">Editor de Diagrama de Clases (próximamente)</p>
        </div>
      </div>
    </div>
  );
}