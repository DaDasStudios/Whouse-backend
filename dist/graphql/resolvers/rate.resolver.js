"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitRate = exports.rate = exports.rates = void 0;
const graphql_1 = require("graphql");
const Rate_1 = __importDefault(require("../../models/Rate"));
const Role_1 = __importDefault(require("../../models/Role"));
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAuthorized_1 = require("../../middlewares/isAuthorized");
const types_1 = require("../types");
// ! QUERY RESOLVER
exports.rates = {
    type: new graphql_1.GraphQLList(types_1.RateType),
    description: "Una lista completa de todos los testimonios",
    async resolve() {
        return await Rate_1.default.find();
    }
};
exports.rate = {
    type: types_1.RateType,
    description: "Un solo testimonio que puede ser solicitado por el autor - Requiere autenticación o rol de administrador",
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    async resolve(_, { id }, ctx) {
        try {
            // ? Permission validations
            const authenticatedUserId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            const authorizedSubject = await (0, isAuthorized_1.isAuthorized)(authenticatedUserId, ["User", "Admin"]);
            // * Find the roles. If the client has "Admin" role, then he can access to the rate, but needs ID
            const foundRoles = await Role_1.default.find({ _id: { $in: authorizedSubject?.roles } });
            if (foundRoles.map(role => role.name).includes("Admin")) {
                if (!id)
                    throw new Error("ID NO PROPORCIONADO");
                return await Rate_1.default.findById(id);
                // * If client has "User" role, he will get the rate with the ID of the authenticated user
            }
            else {
                return await Rate_1.default.findOne({ author: authorizedSubject?._id });
            }
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
// ! MUTATION RESOLVER
exports.submitRate = {
    type: types_1.RateType,
    description: "Crear un testimonio o actualizarlo si ya ha sido creado - Requiere autenticación",
    args: {
        testimonial: { type: graphql_1.GraphQLString }
    },
    async resolve(_, { testimonial }, ctx) {
        try {
            const userId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            const foundUser = await (0, isAuthorized_1.isAuthorized)(userId, ["User"]);
            const foundRate = await Rate_1.default.findOne({ author: foundUser?._id });
            // ? Validations
            if (!testimonial)
                throw new Error("INFORMACIÓN INCOMPLETA");
            // * Create the rate for first time
            if (foundRate === null) {
                const newRate = new Rate_1.default({ testimonial, author: foundUser?._id });
                return await newRate.save();
                // * Update the created one
            }
            else {
                return await Rate_1.default.findByIdAndUpdate(foundRate?._id, { testimonial }, { new: true });
            }
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
//# sourceMappingURL=rate.resolver.js.map