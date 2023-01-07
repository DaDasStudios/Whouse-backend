"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Contact", contactSchema);
//# sourceMappingURL=Contact.js.map