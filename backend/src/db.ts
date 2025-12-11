import sqlite3 from "sqlite3"
import path from "path"
import { Zone } from "./types"

sqlite3.verbose()

const dbPath = path.join(__dirname, "..", "heatflow.db")
export const db = new sqlite3.Database(dbPath)

export function initDb() {
  db.serialize(() => {
    // Tabela de zonas (setores da loja)
    db.run(`
      CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
      );
    `)

    // Registro de amostras de "dispositivos" por zona
    db.run(`
      CREATE TABLE IF NOT EXISTS heat_samples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER NOT NULL,
        device_count INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (zone_id) REFERENCES zones(id)
      );
    `)

    // Inserir zonas padrão se a tabela estiver vazia
    db.get(`SELECT COUNT(*) as count FROM zones`, (err, row: any) => {
      if (err) {
        console.error("Erro ao contar zonas:", err)
        return
      }
      if (row.count === 0) {
        const defaultZones: Zone[] = [
          { id: 1, code: "ENTRADA", name: "Entrada / Frente de Loja" },
          { id: 2, code: "FLV", name: "Hortifruti (FLV)" },
          { id: 3, code: "CAIXAS", name: "Frente de Caixa" },
          { id: 4, code: "CORREDOR_1", name: "Corredor 1 - Mercearia" },
          { id: 5, code: "CORREDOR_2", name: "Corredor 2 - Limpeza" },
        ]

        const stmt = db.prepare(`INSERT INTO zones (code, name) VALUES (?, ?)`)
        defaultZones.forEach(z => {
          stmt.run(z.code, z.name)
        })
        stmt.finalize()
        console.log("Zonas padrão inseridas.")
      }
    })
  })
}
