import mongoose, { Schema, Document, Model } from "mongoose";
import BookingLeg, { IBookingLeg } from "./BookingLeg";

export interface IBooking extends Document {
    bookingLegs: IBookingLeg[]
    frequentFlyerID: string
    creditCardNumber: string
}

let schema = new Schema({
    bookingLegs: { type: [BookingLeg], required: true, default: [] },
    creditCardNumber: { type: String, match: /^[0-9]{16}$/, required: true },
    frequentFlyerID: { type: String, match: /^[A-Z0-9]{7}$/ },
});

const schemaName = "Booking";

const TypeExport: Model<IBooking> = mongoose.model<IBooking>(schemaName, schema);

export default TypeExport;
