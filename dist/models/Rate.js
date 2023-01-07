"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rateSchema = new mongoose_1.Schema({
    testimonial: {
        type: String,
        required: true,
    },
    author: {
        unique: true,
        ref: "User",
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Rate", rateSchema);
//# sourceMappingURL=Rate.js.map