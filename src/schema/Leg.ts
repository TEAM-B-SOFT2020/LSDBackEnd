
import mongoose, { Schema, Document, Model } from "mongoose";
import { IRoute } from "./Route";
import _ from "lodash"

const mongooseIncrement = require('mongoose-increment')

const increment = mongooseIncrement(mongoose);

export interface ILeg extends Document {
    id: number
    paddedId: string

    route: IRoute

    week: number
    year: number
}

let schema = new Schema({
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true },

    week: { type: Number, required: true, min: 0, max: 53 },
    year: { type: Number, required: true, min: 1970 }
});
 
schema.virtual("paddedId").get(function (this: { id: string }) {
    return _.padStart(this.id, 3, "0")
})

schema.plugin(increment, {
    modelName: 'Leg',
    fieldName: 'id',
    unique: true,
    resetAfter: 999,
})

const schemaName = "Leg";

const TypeExport: Model<ILeg> = mongoose.model<ILeg>(schemaName, schema);



export default TypeExport;
