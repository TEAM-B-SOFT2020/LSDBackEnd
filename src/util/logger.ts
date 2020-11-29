import { createLogger, format, transports } from "winston"

const { label, combine, timestamp, prettyPrint } = format
const logger = createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/info.log", level: "info" }),
  ],
  exitOnError: false,
})

export default logger
