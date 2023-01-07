"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const isAuthenticated = (req) => {
    const token = req.header('x-access-token');
    if (!token)
        throw new Error("TOKEN NO PROPORCIONADO");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.JWT_SECRET);
        return decoded.id;
    }
    catch (err) {
        throw new Error("TOKEN INVÁLIDO");
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=isAuthenticated.js.map