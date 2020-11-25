import mongoose, { Schema, Document, Model } from "mongoose";
import { IAirport } from "./Airport";
import { ICarrier } from "./Carrier";

export interface IRoute extends Document {
    carrier: ICarrier,

    weekday: number,
    departureSecondInDay: number,
    durationInSeconds: number,

    departureAirport: IAirport,
    arrivalAirport: IAirport

    numberOfSeats: number,
    seatPrice: number
}

let schema = new Schema({
    carrier: { type: Schema.Types.ObjectId, ref: "Carrier", required: true },

    weekday: { type: Number, required: true, min: 0, max: 6 },
    departureSecondInDay: { type: Number, required: true, min: 0, max: 86399 },
    durationInSeconds: { type: Number, required: true, min: 0 },

    departureAirport: { type: Schema.Types.ObjectId, ref: "Airport", required: true },
    arrivalAirport: { type: Schema.Types.ObjectId, ref: "Airport", required: true },

    numberOfSeats: { type: Number, required: true, min: 1 },
    seatPrice: { type: Number, required: true, min: 0 }
});

const schemaName = "Route";

const TypeExport: Model<IRoute> = mongoose.model<IRoute>(schemaName, schema);

export default TypeExport;
