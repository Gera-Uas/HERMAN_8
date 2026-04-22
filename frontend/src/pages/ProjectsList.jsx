import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useProjects } from '@/lib/ProjectContext';
import ProjectCard from '@/components/ProjectCard';
import ProjectEditModal from '@/components/ProjectEditModal';
import { createPageUrl } from '@/utils';

export default function ProjectsList() {
  const navigate = useNavigate();
  const { projects, currentProject, addProject, updateProject, deleteProject, selectProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSave = (formData) => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
    }
    handleCloseModal();
  };

  const handleSelectProject = (project) => {
    selectProject(project);
    // Navegar a /Home después de seleccionar proyecto
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
            <p className="text-gray-600 mt-1">Gestiona todos tus proyectos en un solo lugar</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Proyecto
          </button>
        </div>

        {/* Grid de Proyectos */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
            <p className="text-gray-600 mb-6">Crea tu primer proyecto para comenzar</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => handleOpenModal(project)}
                onDelete={deleteProject}
                onSelect={handleSelectProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProjectEditModal
          project={editingProject}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
