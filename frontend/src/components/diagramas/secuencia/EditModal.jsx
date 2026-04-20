import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const actorTypes = [
  { value: "actor",    label: "Actor" },
  { value: "system",   label: "Sistema" },
  { value: "database", label: "Base de datos" },
  { value: "external", label: "Externo" },
  { value: "service",  label: "Servicio" },
];

const messageTypes = [
  { value: "sync",   label: "Síncrono" },
  { value: "async",  label: "Asíncrono" },
  { value: "return", label: "Retorno" },
];

const fragmentTypes = [
  { value: "alt",  label: "alt — alternativa" },
  { value: "loop", label: "loop — bucle" },
  { value: "opt",  label: "opt — opcional" },
  { value: "par",  label: "par — paralelo" },
];

const titles = {
  actor: "Editar participante",
  message: "Editar mensaje",
  fragment: "Editar fragmento",
  note: "Editar nota",
};

export default function EditModal({ target, actors, onSave, onClose }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({ ...target.item });
  }, [target]);

  const handleSave = () => onSave(form);

  const { type } = target;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h3 className="font-semibold text-white">{titles[type] || "Editar"}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {type === "actor" && (
            <>
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input value={form.name || ""} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del participante" autoFocus />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {actorTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {type === "message" && (
            <>
              <div className="space-y-1.5">
                <Label>Etiqueta del mensaje</Label>
                <Input value={form.label || ""} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Ej: login(), getData()" autoFocus />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo de mensaje</Label>
                <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {messageTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Desde</Label>
                  <Select value={form.from} onValueChange={(v) => setForm(p => ({ ...p, from: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {actors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Hasta</Label>
                  <Select value={form.to} onValueChange={(v) => setForm(p => ({ ...p, to: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {actors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {type === "fragment" && (
            <>
              <div className="space-y-1.5">
                <Label>Tipo de fragmento</Label>
                <Select value={form.fragType} onValueChange={(v) => setForm(p => ({ ...p, fragType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fragmentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Condición / descripción</Label>
                <Input value={form.condition || ""} onChange={(e) => setForm(p => ({ ...p, condition: e.target.value }))} placeholder="Ej: [si usuario autenticado]" autoFocus />
              </div>
            </>
          )}

          {type === "note" && (
            <div className="space-y-1.5">
              <Label>Texto de la nota</Label>
              <Textarea
                value={form.text || ""}
                onChange={(e) => setForm(p => ({ ...p, text: e.target.value }))}
                placeholder="Escribe tu nota aquí..."
                className="min-h-[100px]"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
            <Save className="w-4 h-4 mr-1" /> Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}