"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.submitContact = exports.contact = exports.contacts = void 0;
const graphql_1 = require("graphql");
const Contact_1 = __importDefault(require("../../models/Contact"));
const types_1 = require("../types");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAuthorized_1 = require("../../middlewares/isAuthorized");
const regExp_1 = require("../../util/regExp");
// ! QUERY RESOLVERS
exports.contacts = {
    type: new graphql_1.GraphQLList(types_1.ContactType),
    description: "La lista completa de intento de contacto del cliente - Requiere rol de administrador",
    async resolve(parent, args, ctx) {
        try {
            const authenticatedAdminId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            await (0, isAuthorized_1.isAuthorized)(authenticatedAdminId, ["Admin"]);
            return await Contact_1.default.find();
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
exports.contact = {
    type: types_1.ContactType,
    description: "Un intento contacto identificado un ID - Requiere rol de administrador",
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    async resolve(parent, { id }, ctx) {
        try {
            const authenticatedAdminId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            await (0, isAuthorized_1.isAuthorized)(authenticatedAdminId, ["Admin"]);
            return await Contact_1.default.findById(id);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
// ! MUTATION RESOLVERS
exports.submitContact = {
    type: new graphql_1.GraphQLObjectType({
        name: "ResponseContactType",
        description: "Respuesta del servidor a una petición de contacto",
        fields: {
            success: { type: graphql_1.GraphQLBoolean },
            data: { type: types_1.ContactType }
        }
    }),
    description: "Envío de información de contacto desde el cliente",
    args: {
        name: { type: graphql_1.GraphQLString },
        lastname: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        location: { type: graphql_1.GraphQLString },
        reason: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
    },
    async resolve(_, { name, lastname, email, location, reason, description }) {
        // ? Validations
        if (!name || !lastname || !email || !location || !reason || !description)
            throw new Error("INFORMACIÓN INCOMPLETA");
        if (!regExp_1.emailRegExp.test(email))
            throw new Error("EMAIL INVÁLIDO");
        const newContactation = new Contact_1.default({ name, lastname, email, location, description, reason });
        const savedContact = await newContactation.save();
        return {
            success: Boolean(savedContact),
            data: newContactation
        };
    }
};
exports.updateContact = {
    type: types_1.ContactType,
    description: "Actualizar la información de intento de contacto - Requiere rol de administrador",
    args: {
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        lastname: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        location: { type: graphql_1.GraphQLString },
        reason: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
    },
    async resolve(parent, { id, name, lastname, email, location, reason, description }, ctx) {
        try {
            const authenticatedAdminId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            await (0, isAuthorized_1.isAuthorized)(authenticatedAdminId, ["Admin"]);
            return await Contact_1.default.findByIdAndUpdate(id, { name, lastname, email, location, reason, description }, { new: true });
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
exports.deleteContact = {
    type: types_1.ContactType,
    description: "Eliminar la información de contacto de uno determinado - Requiere rol de administrador",
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    async resolve(parent, { id }, ctx) {
        try {
            const authenticatedAdminId = (0, isAuthenticated_1.isAuthenticated)(ctx);
            await (0, isAuthorized_1.isAuthorized)(authenticatedAdminId, ["Admin"]);
            return await Contact_1.default.findOneAndDelete(id);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
};
//# sourceMappingURL=contact.resolver.js.map