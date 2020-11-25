import mongoose, { Schema, Document, Model } from "mongoose";
import { IBooking } from "./Booking";
import { ILeg } from "./Leg";
import Passenger, { IPassenger } from "./Passenger";


export interface IBookingLeg {
    leg: ILeg
    passengers: IPassenger[]
}

export default new Schema({
    leg: { type: Schema.Types.ObjectId, ref: "Leg", required: true },
    passengers: { type: [Passenger], required: true, default: [], validate: [(val: IPassenger[]) => val.length > 0 && val.length <= 9, '{PATH} exceeds the limit of 9'] }
});