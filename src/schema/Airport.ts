import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAirport extends Document {
    iata: string;
    name: string;
    timeZone: string
}

let schema = new Schema({
    iata: { type: String, match: /^[A-Z]{3}$/, required: true, unique: true },
    name: { type: String, required: true },
    timeZone: { type: String, required: true }
});

const schemaName = "Airport";

const TypeExport: Model<IAirport> = mongoose.model<IAirport>(schemaName, schema);

export default TypeExport;
