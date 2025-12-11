import { Router } from "express"
import { db } from "../db"
import { ZoneHeatLevel } from "../types"

const router = Router()

// Normalizador simples
const MAX_DEVICES_PER_ZONE = 30

function mapToDensityLevel(score: number): "low" | "medium" | "high" {
  if (score < 0.33) return "low"
  if (score < 0.66) return "medium"
  return "high"
}

/**
 * GET /api/heat/current
 * Retorna densidade atual por zona baseada nas últimas N amostras (ex.: 5 minutos)
 */
router.get("/current", (req, res) => {
  const minutes = Number(req.query.minutes) || 5

  const sql = `
    SELECT
      z.id as zone_id,
      z.code as zone_code,
      z.name as zone_name,
      AVG(h.device_count) as avg_devices
    FROM zones z
    LEFT JOIN heat_samples h
      ON h.zone_id = z.id
      AND h.created_at >= datetime('now', ?)
    GROUP BY z.id, z.code, z.name
  `

  const since = `-${minutes} minutes`

  db.all(sql, [since], (err, rows: any[]) => {
    if (err) {
      console.error("Erro ao buscar densidade atual:", err)
      return res.status(500).json({ error: "Erro ao buscar densidade." })
    }

    const data: ZoneHeatLevel[] = rows.map(row => {
      const avgDevices = row.avg_devices || 0
      const score = Math.min(avgDevices / MAX_DEVICES_PER_ZONE, 1)
      const level = mapToDensityLevel(score)

      return {
        zoneId: row.zone_id,
        zoneCode: row.zone_code,
        zoneName: row.zone_name,
        deviceCount: Math.round(avgDevices),
        densityScore: Number(score.toFixed(2)),
        densityLevel: level,
      }
    })

    res.json({ data })
  })
})

/**
 * GET /api/heat/history
 * Retorna histórico resumido por zona e hora (para gráficos).
 */
router.get("/history", (req, res) => {
  const hours = Number(req.query.hours) || 6

  const sql = `
    SELECT
      z.id as zone_id,
      z.name as zone_name,
      strftime('%H:%M', h.created_at) as time_label,
      AVG(h.device_count) as avg_devices
    FROM heat_samples h
    JOIN zones z ON z.id = h.zone_id
    WHERE h.created_at >= datetime('now', ?)
    GROUP BY z.id, z.name, time_label
    ORDER BY time_label ASC;
  `

  const since = `-${hours} hours`

  db.all(sql, [since], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar histórico:", err)
      return res.status(500).json({ error: "Erro ao buscar histórico." })
    }

    res.json({ data: rows })
  })
})

export default router
