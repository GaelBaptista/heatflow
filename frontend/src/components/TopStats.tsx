import React from "react"
import { ZoneHeatLevel } from "../api/heatService"

interface TopStatsProps {
  heatData: ZoneHeatLevel[]
}

export const TopStats: React.FC<TopStatsProps> = ({ heatData }) => {
  const totalZones = heatData.length
  const high = heatData.filter(z => z.densityLevel === "high").length
  const medium = heatData.filter(z => z.densityLevel === "medium").length
  const low = heatData.filter(z => z.densityLevel === "low").length

  const busiest = [...heatData].sort((a, b) => b.deviceCount - a.deviceCount)[0]

  return (
    <div className="stats-grid">
      <div className="card">
        <span className="card-label">Zonas monitoradas</span>
        <span className="card-value">{totalZones}</span>
      </div>
      <div className="card">
        <span className="card-label">Zonas em alta densidade</span>
        <span className="card-value highlight">{high}</span>
      </div>
      <div className="card">
        <span className="card-label">Médio / Baixo</span>
        <span className="card-value">
          {medium} / {low}
        </span>
      </div>
      <div className="card">
        <span className="card-label">Setor mais movimentado</span>
        <span className="card-value">{busiest ? busiest.zoneName : "-"}</span>
      </div>
    </div>
  )
}
