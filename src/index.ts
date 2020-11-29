// libraries
import dotenv from "dotenv"
import express from "express"
import monitor from "express-status-monitor"

import * as dbHandler from "./util/dbHandler"

// classes, interfaces & functions
import ContractRPC from "./contract/ContractRPC"
dotenv.config()

const connectionString: string | undefined = process.env.CONNECTION_STRING

if (!connectionString) {
  throw new Error("Cant find the connection string, did you add it to your .env file?")
}

dbHandler.connect(connectionString)

// environments variables -> .env or from custom module
const port: number = 3000

const app: express.Application = express()
app.use(monitor())
app.post("/", ContractRPC)

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
