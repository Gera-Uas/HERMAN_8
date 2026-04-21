import React, { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import ClassDiagramTable from "@/components/diagramas/clases/ClassDiagramTable";
import DiagramCreateEditModal from "@/components/diagramas/DiagramCreateEditModal";

const STORAGE_KEY = "class_diagrams";

export default function DiagramasClases() {
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
      setShowModal(false);
    } else {
      // Create new
      const newDiagram = {
        id: `class-${Date.now()}`,
        ...formData,
        classes: [
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
        ],
        relationships: [],
        interfaces: [],
        enums: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDiagrams(prev => [...prev, newDiagram]);
      // Navegar automáticamente al nuevo diagrama
      setTimeout(() => {
        navigate(`/diagrama-clases-editor/${newDiagram.id}`);
      }, 100);
      setShowModal(false);
      return;
    }
  };

  const handleView = (diagram) => {
    navigate(`/diagrama-clases-editor/${diagram.id}`, { state: { readonly: true } });
  };

  const handleEditDiagram = (diagram) => {
    navigate(`/diagrama-clases-editor/${diagram.id}`);
  };

  const handleDelete = (diagramId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este diagrama?")) {
      setDiagrams(prev => prev.filter(d => d.id !== diagramId));
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title="Diagramas de Clases"
        description="Gestiona tus diagramas de clases UML"
        icon={LayoutGrid}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <ClassDiagramTable
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
          type="class"
          diagram={modalTarget}
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
