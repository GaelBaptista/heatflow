import { db } from "../db"

// Limite máximo de dispositivos esperados por zona (para normalizar)
const MAX_DEVICES_PER_ZONE = 30

// Gera um número aleatório dentro de um range
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Simula densidades diferentes por zona:
function getRandomDeviceCountForZone(zoneCode: string): number {
  switch (zoneCode) {
    case "ENTRADA":
      return randomInt(5, 20)
    case "FLV":
      return randomInt(3, 18)
    case "CAIXAS":
      return randomInt(2, 25)
    case "CORREDOR_1":
      return randomInt(1, 12)
    case "CORREDOR_2":
      return randomInt(1, 10)
    default:
      return randomInt(1, 8)
  }
}

export function startWifiSimulator() {
  console.log("Iniciando simulador de fluxo (Wi-Fi)...")

  setInterval(() => {
    db.all(`SELECT id, code FROM zones`, (err, zones: any[]) => {
      if (err) {
        console.error("Erro ao buscar zonas:", err)
        return
      }

      const stmt = db.prepare(
        `INSERT INTO heat_samples (zone_id, device_count) VALUES (?, ?)`
      )

      zones.forEach(zone => {
        const devices = getRandomDeviceCountForZone(zone.code)
        stmt.run(zone.id, devices)
      })

      stmt.finalize()
      console.log("Amostras simuladas inseridas:", new Date().toISOString())
    })
  }, 10_000) // a cada 10 segundos
}
