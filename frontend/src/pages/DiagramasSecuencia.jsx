import React, { useState, useEffect } from "react";
import { GitBranch, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import SequenceDiagramTable from "@/components/diagramas/secuencia/SequenceDiagramTable";
import DiagramCreateEditModal from "@/components/diagramas/DiagramCreateEditModal";

const STORAGE_KEY = "sequence_diagrams";

export default function DiagramasSecuencia() {
  const navigate = useNavigate();
  const [diagrams, setDiagrams] = useState([]);
  const [modalTarget, setModalTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDiagrams(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading diagrams:", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  }, [diagrams]);

  const handleCreateNew = () => {
    setModalTarget(null);
    setShowModal(true);
  };

  const handleEdit = (diagram) => {
    setModalTarget(diagram);
    setShowModal(true);
  };

  const handleSaveModal = (formData) => {
    if (modalTarget) {
      // Edit existing
      setDiagrams(prev =>
        prev.map(d =>
          d.id === modalTarget.id
            ? { ...d, ...formData, updatedAt: new Date().toISOString() }
            : d
        )
      );
    } else {
      // Create new
      const newDiagram = {
        id: `seq-${Date.now()}`,
        ...formData,
        actors: [
          { id: "a1", name: "Actor 1", type: "actor", x: 100 },
          { id: "a2", name: "Sistema", type: "system", x: 300 },
        ],
        messages: [],
        fragments: [],
        notes: [],
        activations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDiagrams(prev => [...prev, newDiagram]);
      // Navegar automáticamente al nuevo diagrama
      setTimeout(() => {
        navigate(`/diagrama-secuencia-editor/${newDiagram.id}`);
      }, 100);
      setShowModal(false);
      return;
    }
    setShowModal(false);
  };

  const handleView = (diagram) => {
    navigate(`/diagrama-secuencia-editor/${diagram.id}`, { state: { readonly: true } });
  };

  const handleEditDiagram = (diagram) => {
    navigate(`/diagrama-secuencia-editor/${diagram.id}`);
  };

  const handleDelete = (diagramId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este diagrama?")) {
      setDiagrams(prev => prev.filter(d => d.id !== diagramId));
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title="Diagramas de Secuencia"
        description="Gestiona tus diagramas de secuencia UML"
        icon={GitBranch}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <SequenceDiagramTable
            diagrams={diagrams}
            onView={handleView}
            onEdit={handleEditDiagram}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
          />
        </div>
      </div>

      {showModal && (
        <DiagramCreateEditModal
          type="sequence"
          diagram={modalTarget}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
