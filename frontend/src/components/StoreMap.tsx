import React from "react"
import { ZoneHeatLevel } from "../api/heatService"

interface StoreMapProps {
  heatData: ZoneHeatLevel[]
}

function getColor(level: ZoneHeatLevel["densityLevel"]): string {
  switch (level) {
    case "low":
      return "#4ade80" // verde
    case "medium":
      return "#facc15" // amarelo
    case "high":
      return "#f97373" // vermelho
    default:
      return "#e5e7eb"
  }
}

export const StoreMap: React.FC<StoreMapProps> = ({ heatData }) => {
  // Helper para pegar intensidade por código
  const findZone = (code: string) => heatData.find(z => z.zoneCode === code)

  const entrada = findZone("ENTRADA")
  const flv = findZone("FLV")
  const caixas = findZone("CAIXAS")
  const corredor1 = findZone("CORREDOR_1")
  const corredor2 = findZone("CORREDOR_2")

  return (
    <div className="map-wrapper">
      <svg viewBox="0 0 400 250" className="store-map">
        {/* Fundo */}
        <rect x="0" y="0" width="400" height="250" fill="#111827" rx="16" />

        {/* Entrada */}
        <rect
          x="10"
          y="200"
          width="380"
          height="40"
          fill={entrada ? getColor(entrada.densityLevel) : "#374151"}
          rx="8"
        />
        <text x="200" y="225" textAnchor="middle" fill="#e5e7eb" fontSize="12">
          Entrada / Frente de Loja
        </text>

        {/* FLV */}
        <rect
          x="10"
          y="10"
          width="120"
          height="80"
          fill={flv ? getColor(flv.densityLevel) : "#374151"}
          rx="8"
        />
        <text x="70" y="55" textAnchor="middle" fill="#e5e7eb" fontSize="12">
          FLV
        </text>

        {/* Caixas */}
        <rect
          x="270"
          y="150"
          width="120"
          height="40"
          fill={caixas ? getColor(caixas.densityLevel) : "#374151"}
          rx="8"
        />
        <text x="330" y="175" textAnchor="middle" fill="#e5e7eb" fontSize="12">
          Caixas
        </text>

        {/* Corredor 1 */}
        <rect
          x="150"
          y="20"
          width="220"
          height="40"
          fill={corredor1 ? getColor(corredor1.densityLevel) : "#374151"}
          rx="6"
        />
        <text x="260" y="45" textAnchor="middle" fill="#e5e7eb" fontSize="11">
          Corredor 1 - Mercearia
        </text>

        {/* Corredor 2 */}
        <rect
          x="150"
          y="80"
          width="220"
          height="40"
          fill={corredor2 ? getColor(corredor2.densityLevel) : "#374151"}
          rx="6"
        />
        <text x="260" y="105" textAnchor="middle" fill="#e5e7eb" fontSize="11">
          Corredor 2 - Limpeza
        </text>
      </svg>
    </div>
  )
}
