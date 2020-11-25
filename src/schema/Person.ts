

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPerson {
    firstName: string
    lastName: string
    agency?: string
}

export default new Schema({
    firstName: { type: String, minlength: 2, required: true },
    lastName: { type: String, minlength: 2, required: true },
    agency: { type: String, minlength: 2 }
});