import React from "react";
import { Package, Construction } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function DiagramaPaquetes() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Diagrama de Paquetes"
        description="Organiza los elementos del sistema en grupos lógicos"
        icon={Package}
      />
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mb-6">
            <Construction className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sección en desarrollo</h2>
          <p className="text-slate-500 text-center max-w-md">
            Aquí podrás documentar los diagramas de paquetes UML del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}