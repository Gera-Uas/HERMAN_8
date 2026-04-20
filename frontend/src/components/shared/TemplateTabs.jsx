import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Folder, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemplateTabs({ 
  informacionContent, 
  evidenciaContent, 
  conclusionesContent,
  activeTab = "informacion",
  onTabChange
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full bg-white border border-slate-200 p-1.5 rounded-2xl h-auto flex gap-2">
        <TabsTrigger 
          value="informacion"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all",
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25"
          )}
        >
          <FileText className="w-4 h-4" />
          Información estructurada
        </TabsTrigger>
        <TabsTrigger 
          value="evidencia"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all",
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25"
          )}
        >
          <Folder className="w-4 h-4" />
          Evidencia
        </TabsTrigger>
        <TabsTrigger 
          value="conclusiones"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all",
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25"
          )}
        >
          <Lightbulb className="w-4 h-4" />
          Conclusiones / Análisis
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="informacion" className="m-0">
          {informacionContent}
        </TabsContent>
        <TabsContent value="evidencia" className="m-0">
          {evidenciaContent}
        </TabsContent>
        <TabsContent value="conclusiones" className="m-0">
          {conclusionesContent}
        </TabsContent>
      </div>
    </Tabs>
  );
}