import React, { useEffect, useState } from "react"
import { fetchCurrentHeat, ZoneHeatLevel } from "../api/heatService"
import { StoreMap } from "./StoreMap"
import { HeatLegend } from "./HeatLegend"
import { TopStats } from "./TopStats"

export const Dashboard: React.FC = () => {
  const [heatData, setHeatData] = useState<ZoneHeatLevel[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const data = await fetchCurrentHeat()
      setHeatData(data)
    } catch (e) {
      console.error("Erro ao carregar heat:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(() => {
      load()
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard">
      <header className="header">
        <h1>HeatFlow – Mapa de Calor da Loja</h1>
        <p>
          Monitoramento em tempo quase real do fluxo de clientes dentro do
          supermercado.
        </p>
      </header>

      {loading && <p>Carregando dados...</p>}

      {!loading && (
        <>
          <TopStats heatData={heatData} />
          <div className="layout">
            <div className="left">
              <StoreMap heatData={heatData} />
            </div>
            <div className="right">
              <HeatLegend />
              <div className="mini-table">
                <h3>Densidade por setor (últimos 5 minutos)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Setor</th>
                      <th>Dispositivos</th>
                      <th>Nível</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatData.map(z => (
                      <tr key={z.zoneId}>
                        <td>{z.zoneName}</td>
                        <td>{z.deviceCount}</td>
                        <td>{z.densityLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
