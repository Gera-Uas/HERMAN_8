import React from "react";
import { Code2, Construction } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function Desarrollo() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Desarrollo"
        description="Implementación y documentación del código fuente"
        icon={Code2}
      />
      
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sección en desarrollo</h2>
          <p className="text-slate-500 text-center max-w-md">
            Esta sección estará disponible próximamente para documentar estándares de código, 
            guías de desarrollo, control de versiones y revisiones de código.
          </p>
        </div>
      </div>
    </div>
  );
}