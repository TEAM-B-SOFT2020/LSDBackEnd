import mongoose, { Schema, Document, Model } from "mongoose";
import BookingLeg, { IBookingLeg } from "./BookingLeg";
import { ILeg } from "./Leg";

export interface IReservation extends Document {
    leg: ILeg
    amountOfSeats: number
}

let schema = new Schema({
    leg: { type: Schema.Types.ObjectId, ref: "Leg", required: true },
    amountOfSeats: { type: Number, required: true, min: 1, max: 9 }
});

const schemaName = "Reservation";

const TypeExport: Model<IReservation> = mongoose.model<IReservation>(schemaName, schema);

export default TypeExport;
