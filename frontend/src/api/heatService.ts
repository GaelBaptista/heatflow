import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:4000/api",
})

export interface ZoneHeatLevel {
  zoneId: number
  zoneCode: string
  zoneName: string
  deviceCount: number
  densityScore: number
  densityLevel: "low" | "medium" | "high"
}

export async function fetchCurrentHeat(): Promise<ZoneHeatLevel[]> {
  const res = await api.get("/heat/current?minutes=5")
  return res.data.data
}
