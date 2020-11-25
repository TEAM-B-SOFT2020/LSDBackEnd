import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICarrier extends Document {
  iata: string;
  name: string;
}

let schema = new Schema({
  iata: { type: String, match: /^[A-Z]{2}$/, required: true, unique: true },
  name: { type: String, required: true },
});

const schemaName = "Carrier";

const TypeExport: Model<ICarrier> = mongoose.model<ICarrier>(schemaName, schema);

export default TypeExport;
