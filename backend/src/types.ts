export interface Zone {
  id: number
  code: string // ex: "FLV", "CAIXAS", "CORREDOR_05"
  name: string // ex: "Hortifruti", "Caixas", "Corredor 5"
}

export interface HeatSample {
  id?: number
  zone_id: number
  device_count: number
  created_at?: string
}

export interface ZoneHeatLevel {
  zoneId: number
  zoneCode: string
  zoneName: string
  deviceCount: number
  densityLevel: "low" | "medium" | "high"
  densityScore: number // 0 a 1
}
