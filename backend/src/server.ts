import express from "express"
import cors from "cors"
import { initDb } from "./db"
import heatRoutes from "./routes/heat"
import { startWifiSimulator } from "./simulator/wifiSimulator"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

initDb()
startWifiSimulator()

app.get("/", (_req, res) => {
  res.json({ message: "HeatFlow API online" })
})

app.use("/api/heat", heatRoutes)

app.listen(PORT, () => {
  console.log(`HeatFlow backend rodando na porta ${PORT}`)
})
