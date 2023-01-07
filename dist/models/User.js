"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    roles: [{
            ref: "Role",
            type: mongoose_1.Schema.Types.ObjectId,
            required: false
        }]
}, {
    versionKey: false,
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("User", UserSchema, "users");
//# sourceMappingURL=User.js.map