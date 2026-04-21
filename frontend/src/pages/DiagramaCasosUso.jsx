import React, { useState } from "react";
import { Users } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import UseCasePalette from "@/components/diagramas/casosUso/UseCasePalette";
import UseCaseCanvas from "@/components/diagramas/casosUso/UseCaseCanvas";

export default function DiagramaCasosUso() {
  const [actors, setActors] = useState([
    { id: "a1", type: "actor", name: "Usuario", description: "Usuario del sistema", x: 50, y: 150 },
    { id: "a2", type: "actor", name: "Administrador", description: "Administrador del sistema", x: 600, y: 150 },
  ]);
  const [useCases, setUseCases] = useState([
    { id: "uc1", type: "usecase", name: "Iniciar sesión", description: "El usuario inicia sesión en el sistema", x: 250, y: 100, width: 120, height: 80 },
    { id: "uc2", type: "usecase", name: "Gestionar datos", description: "Administración de datos del sistema", x: 250, y: 220, width: 120, height: 80 },
  ]);
  const [associations, setAssociations] = useState([]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PageHeader
        title="Diagrama de Casos de Uso"
        description="Editor visual UML — arrastra elementos para construir tu diagrama"
        icon={Users}
      />
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