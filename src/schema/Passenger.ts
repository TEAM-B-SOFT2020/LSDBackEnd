

import mongoose, { Schema, Document, Model } from "mongoose";
import { ILeg } from "./Leg";
import Person, { IPerson } from "./Person";

export interface IPassenger {
    pnr: string
    person: IPerson
}

export default new Schema({
    pnr: { type: String, match: /^[A-Z0-9]{5,6}$/, required: true, unique: true },
    person: { type: Person, required: true }
});