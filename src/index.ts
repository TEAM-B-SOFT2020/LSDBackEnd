// libraries
import dotenv from "dotenv"
import express from "express"

// classes, interfaces & functions
import ContractRPC from "./contract/ContractRPC"

dotenv.config()

// environments variables -> .env or from custom module
const port: number = 3000

const app: express.Application = express()
app.post("/", ContractRPC)

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
