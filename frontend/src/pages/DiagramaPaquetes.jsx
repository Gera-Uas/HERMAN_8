import React, { useState, useEffect } from "react";
import { Package, ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import PackagePalette from "@/components/diagramas/paquetes/PackagePalette";
import PackageCanvas from "@/components/diagramas/paquetes/PackageCanvas";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "package_diagrams";

export default function DiagramaPaquetes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [packages, setPackages] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [diagramName, setDiagramName] = useState("Diagrama de Paquetes");
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
            setPackages(diagram.packages || []);
            setDependencies(diagram.dependencies || []);
            setNotes(diagram.notes || []);
            setDiagramName(diagram.name);
          }
        } catch (e) {
          console.error("Error loading diagram:", e);
        }
      }
      setIsLoading(false);
    } else {
      // Default state for new diagram
      setPackages([
        {
          id: "p1",
          type: "package",
          name: "Paquete 1",
          description: "",
          x: 100,
          y: 100,
          width: 200,
          height: 150,
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
        packages,
        dependencies,
        notes,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        diagrams[index] = { ...diagrams[index], ...updatedDiagram };
      } else {
        diagrams.push(updatedDiagram);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    }
  }, [id, packages, dependencies, notes, diagramName, isLoading]);

  const handleBack = () => {
    navigate("/DiagramasPaquetes");
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
        icon={Package}
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
        <PackagePalette />
        <PackageCanvas
          packages={packages}
          setPackages={setPackages}
          dependencies={dependencies}
          setDependencies={setDependencies}
          notes={notes}
          setNotes={setNotes}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}