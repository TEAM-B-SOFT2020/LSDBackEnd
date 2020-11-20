import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICarrier extends Document {
  iata: string;
  name: string;
}

let schema = new Schema({
  iata: { type: String, minlength: 2, maxlength: 2, required: true, unique: true },
  name: { type: String, required: true },
});

const schemaName = "Carrier";

// global[schemaName] = global[schemaName] || mongoose.model<IAPIKeySetting>(schemaName, schema);

const TypeExport: Model<ICarrier> = mongoose.model<ICarrier>(schemaName, schema);

export default TypeExport;
