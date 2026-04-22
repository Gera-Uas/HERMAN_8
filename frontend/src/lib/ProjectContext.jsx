import React, { createContext, useState, useContext, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  // Cargar proyectos desde localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Error loading projects:', e);
      }
    } else {
      // Proyectos por defecto
      const defaultProjects = [
        {
          id: 1,
          name: 'Proyecto 1',
          description: 'Mi primer proyecto',
          status: 'En progreso',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Proyecto 2',
          description: 'Segundo proyecto',
          status: 'Completado',
          createdAt: new Date().toISOString()
        }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('projects', JSON.stringify(defaultProjects));
    }
  }, []);

  // Guardar proyectos en localStorage cuando cambien
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      ...projectData,
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (id, projectData) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...projectData } : p));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const selectProject = (project) => {
    setCurrentProject(project);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      addProject,
      updateProject,
      deleteProject,
      selectProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};
