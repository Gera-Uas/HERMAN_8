import React from "react";
import { Layers, Construction } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function Diseno() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Diseño"
        description="Arquitectura, diagramas y modelos del sistema"
        icon={Layers}
      />
      
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sección en desarrollo</h2>
          <p className="text-slate-500 text-center max-w-md">
            Esta sección estará disponible próximamente para documentar diagramas UML, 
            arquitectura del sistema, modelos de datos y prototipos de interfaz.
          </p>
        </div>
      </div>
    </div>
  );
}