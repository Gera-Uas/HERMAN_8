import React from "react";
import { FileText, Construction } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function Requerimientos() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Requerimientos"
        description="Especificación de requisitos funcionales y no funcionales"
        icon={FileText}
      />
      
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sección en desarrollo</h2>
          <p className="text-slate-500 text-center max-w-md">
            Esta sección estará disponible próximamente para documentar requisitos funcionales, 
            no funcionales, casos de uso y criterios de aceptación.
          </p>
        </div>
      </div>
    </div>
  );
}