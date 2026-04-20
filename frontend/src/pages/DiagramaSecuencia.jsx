import React, { useState, useRef, useCallback } from "react";
import { GitBranch } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SequencePalette from "@/components/diagramas/secuencia/SequencePalette";
import SequenceCanvas from "@/components/diagramas/secuencia/SequenceCanvas";

export default function DiagramaSecuencia() {
  const [actors, setActors] = useState([
    { id: "a1", name: "Usuario", type: "actor", x: 100 },
    { id: "a2", name: "Sistema", type: "system", x: 300 },
  ]);
  const [messages, setMessages] = useState([
    { id: "m1", from: "a1", to: "a2", label: "solicitar()", type: "sync", order: 1 },
    { id: "m2", from: "a2", to: "a1", label: "respuesta()", type: "return", order: 2 },
  ]);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHeader
        title="Diagrama de Secuencia"
        description="Editor visual UML — arrastra componentes al canvas para construir tu diagrama"
        icon={GitBranch}
      />
      <div className="flex flex-1 min-h-0" style={{ height: "calc(100vh - 89px)" }}>
        <SequencePalette />
        <SequenceCanvas
          actors={actors}
          setActors={setActors}
          messages={messages}
          setMessages={setMessages}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}