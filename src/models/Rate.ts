import { Schema, model } from "mongoose";

const rateSchema = new Schema({
    testimonial: {
        type: String,
        required: true,
    },
    author: {
        unique: true,
        ref: "User",
        type: Schema.Types.ObjectId,
        required: true,
    }
}, {
    timestamps: true,
})

export default model("Rate", rateSchema)