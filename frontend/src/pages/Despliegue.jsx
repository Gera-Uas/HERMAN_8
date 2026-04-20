import React from "react";
import { Rocket, Construction } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function Despliegue() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Despliegue"
        description="Configuración y documentación de la puesta en producción"
        icon={Rocket}
      />
      
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sección en desarrollo</h2>
          <p className="text-slate-500 text-center max-w-md">
            Esta sección estará disponible próximamente para documentar procedimientos de despliegue, 
            configuración de ambientes, checklists de lanzamiento y rollback.
          </p>
        </div>
      </div>
    </div>
  );
}