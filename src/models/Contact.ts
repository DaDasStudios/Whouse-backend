import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: { 
        type: String, 
        required: true },
    email: {
        type: String,
        required: true,
    },
    location: { 
        type: String, 
        required: true },
    reason: { 
        type: String, 
        required: true },
    description: { 
        type: String, 
        required: true },
}, {
    timestamps: true,
})

export default model("Contact", contactSchema)