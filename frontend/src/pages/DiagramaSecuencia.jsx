import React, { useState, useRef, useCallback, useEffect } from "react";
import { GitBranch, ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import SequencePalette from "@/components/diagramas/secuencia/SequencePalette";
import SequenceCanvas from "@/components/diagramas/secuencia/SequenceCanvas";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "sequence_diagrams";

export default function DiagramaSecuencia() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [actors, setActors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
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
            setMessages(diagram.messages || []);
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
        { id: "a1", name: "Usuario", type: "actor", x: 100 },
        { id: "a2", name: "Sistema", type: "system", x: 300 },
      ]);
      setMessages([
        { id: "m1", from: "a1", to: "a2", label: "solicitar()", type: "sync", order: 1 },
        { id: "m2", from: "a2", to: "a1", label: "respuesta()", type: "return", order: 2 },
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
        actors,
        messages,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        diagrams[index] = { ...diagrams[index], ...updatedDiagram };
      } else {
        diagrams.push(updatedDiagram);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    }
  }, [id, actors, messages, diagramName, isLoading]);

  const handleBack = () => {
    navigate("/DiagramasSecuencia");
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Cargando diagrama...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden overflow-x-hidden">
      <PageHeader
        title={diagramName}
        description="Editor visual UML — arrastra componentes al canvas para construir tu diagrama"
        icon={GitBranch}
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
        <SequencePalette />
        <SequenceCanvas
          actors={actors}
          setActors={setActors}
          messages={messages}
          setMessages={setMessages}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}