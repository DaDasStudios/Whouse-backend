"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.user = exports.users = void 0;
const graphql_1 = require("graphql");
const User_1 = __importDefault(require("../../models/User"));
const Role_1 = __importDefault(require("../../models/Role"));
const regExp_1 = require("../../util/regExp");
const types_1 = require("../types");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAuthorized_1 = require("../../middlewares/isAuthorized");
// ! QUERY RESOLVERS
exports.users = {
    description: "Obtener todas las cuentas de los usuario - Requiere rol de administrador",
    type: new graphql_1.GraphQLList(types_1.UserType),
    async resolve(_, __, ctx) {
        try {
            const id = (0, isAuthenticated_1.isAuthenticated)(ctx);
            const authorized = await (0, isAuthorized_1.isAuthorized)(id, ["Admin"]);
            if (authorized)
                return await User_1.default.find();
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
exports.user = {
    description: "Obtener un solo usuario - Requiere rol de administrador",
    type: types_1.UserType,
    args: {
        id: { type: graphql_1.GraphQLID }
    },
    async resolve(_, { id }, ctx) {
        try {
            const authenticatedUserId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            const authorized = await (0, isAuthorized_1.isAuthorized)(authenticatedUserId, ["Admin"]);
            if (authorized)
                return await User_1.default.findById(id);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
// ! MUTATION RESOLVERS
exports.updateUser = {
    type: types_1.UserType,
    description: "Actualizar los datos de un usuario ya registrado",
    args: {
        id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        imageUrl: { type: graphql_1.GraphQLString },
        occupation: { type: graphql_1.GraphQLString },
    },
    async resolve(_, { id, username, email, imageUrl, occupation }, ctx) {
        try {
            // ? Check out the permission
            const authenticatedUserId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            const isUserOrAdmin = await (0, isAuthorized_1.isAuthorized)(authenticatedUserId, ["User", "Admin"]);
            if (isUserOrAdmin) {
                // * Find a user in order to verify if it's an admin or a normal user
                const foundUser = await User_1.default.findById(authenticatedUserId);
                // * Find the user's roles
                const roles = await Role_1.default.find({ _id: { $in: foundUser?.roles } });
                if (
                // * In case it is user, the user who is trying to update information must be himself
                (roles.some(r => r.name === "User") && foundUser?._id.toString() === id)
                    ||
                        // * In case it is an Admin, just continue with the updating
                        (roles.some(r => r.name === "Admin"))) {
                    if (email && !regExp_1.emailRegExp.test(email))
                        throw new Error("EMAIL INVÁLIDO");
                    return await User_1.default.findByIdAndUpdate(id, { username, email, imageUrl, occupation }, { new: true });
                }
            }
            throw new Error('USUARIO NO AUTORIZADO');
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
exports.deleteUser = {
    type: types_1.UserType,
    description: "Eliminar un usuario existente - Requiere rol de administrador",
    args: {
        id: { type: graphql_1.GraphQLID }
    },
    async resolve(_, { id }, ctx) {
        try {
            // ? Check out the permission
            const authenticatedUserId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            const isAdmin = await (0, isAuthorized_1.isAuthorized)(authenticatedUserId, ["Admin"]);
            if (isAdmin) {
                return await User_1.default.findByIdAndDelete(id);
            }
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
//# sourceMappingURL=user.resolver.js.map