import React from "react";
import { TestTube, Construction } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function Pruebas() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Pruebas"
        description="Casos de prueba y resultados de validación"
        icon={TestTube}
      />
      
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sección en desarrollo</h2>
          <p className="text-slate-500 text-center max-w-md">
            Esta sección estará disponible próximamente para documentar planes de prueba, 
            casos de prueba, resultados de ejecución y reportes de defectos.
          </p>
        </div>
      </div>
    </div>
  );
}