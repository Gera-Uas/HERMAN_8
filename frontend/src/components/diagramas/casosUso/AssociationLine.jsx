import React from "react";
import { Trash2 } from "lucide-react";

export default function AssociationLine({ 
  association, 
  actors, 
  useCases, 
  isSelected, 
  onClick, 
  onDelete 
}) {
  // Encontrar los elementos
  const getElement = (id) => {
    return actors.find(a => a.id === id) || useCases.find(u => u.id === id);
  };

  const fromElement = getElement(association.from);
  const toElement = getElement(association.to);

  if (!fromElement || !toElement) return null;

  // Calcular centros de los elementos
  const fromX = fromElement.x + (fromElement.type === "actor" ? 50 : 60);
  const fromY = fromElement.y + (fromElement.type === "actor" ? 50 : 40);
  
  const toX = toElement.x + (toElement.type === "actor" ? 50 : 60);
  const toY = toElement.y + (toElement.type === "actor" ? 50 : 40);

  // Calcular punto medio para el label
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  return (
    <g style={{ zIndex: 5, cursor: "pointer" }} onClick={onClick}>
      {/* Línea de asociación */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={isSelected ? "#6366f1" : "#cbd5e1"}
        strokeWidth={isSelected ? 2.5 : 2}
        pointerEvents="stroke"
      />

      {/* Punta de flecha */}
      <defs>
        <marker
          id={`arrowhead-${association.id}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill={isSelected ? "#6366f1" : "#cbd5e1"}
          />
        </marker>
      </defs>

      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={isSelected ? "#6366f1" : "#cbd5e1"}
        strokeWidth={isSelected ? 2.5 : 2}
        markerEnd={`url(#arrowhead-${association.id})`}
        pointerEvents="none"
      />

      {/* Área de interacción más grande para facilitar selección */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="transparent"
        strokeWidth="8"
        pointerEvents="stroke"
      />

      {/* Label de la asociación */}
      {association.label && (
        <g>
          <rect
            x={midX - 40}
            y={midY - 12}
            width="80"
            height="20"
            fill="white"
            stroke={isSelected ? "#6366f1" : "#cbd5e1"}
            strokeWidth="1"
            rx="3"
            pointerEvents="none"
          />
          <text
            x={midX}
            y={midY + 4}
            fontSize="11"
            fill={isSelected ? "#6366f1" : "#64748b"}
            textAnchor="middle"
            pointerEvents="none"
            fontWeight="500"
          >
            {association.label}
          </text>
        </g>
      )}

      {/* Delete button cuando está seleccionado */}
      {isSelected && (
        <g
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ cursor: "pointer" }}
        >
          <circle cx={midX} cy={midY} r="12" fill="#ef4444" opacity="0.9" />
          <text
            x={midX}
            y={midY + 4}
            fontSize="16"
            fill="white"
            textAnchor="middle"
            pointerEvents="none"
            fontWeight="bold"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
}
