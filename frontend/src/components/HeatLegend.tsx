import React from "react"

export const HeatLegend: React.FC = () => {
  return (
    <div className="legend">
      <h3>Densidade de fluxo</h3>
      <div className="legend-row">
        <span className="legend-color low" />
        <span>Baixo fluxo</span>
      </div>
      <div className="legend-row">
        <span className="legend-color medium" />
        <span>Médio fluxo</span>
      </div>
      <div className="legend-row">
        <span className="legend-color high" />
        <span>Alto fluxo</span>
      </div>
    </div>
  )
}
