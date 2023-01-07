"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const isAuthorized = async (id, roles) => {
    if (id) {
        const user = await User_1.default.findById(id);
        const foundRolesNames = (await Role_1.default.find({ _id: { $in: user?.roles } })).map(e => e.name);
        if (roles.some(e => foundRolesNames.includes(e)))
            return user;
        else
            throw new Error("USUARIO NO AUTORIZADO");
    }
    else
        throw new Error("USUARIO NO ENCONTRADO");
};
exports.isAuthorized = isAuthorized;
//# sourceMappingURL=isAuthorized.js.map