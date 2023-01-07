"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateType = exports.ContactType = exports.UserType = void 0;
const graphql_1 = require("graphql");
const User_1 = __importDefault(require("../models/User"));
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "UserType",
    description: "Usuario tomado desde la base de datos",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        imageUrl: { type: graphql_1.GraphQLString },
        occupation: { type: graphql_1.GraphQLString },
        roles: { type: new graphql_1.GraphQLList(graphql_1.GraphQLID) },
        createdAt: { type: graphql_1.GraphQLString },
        updatedAt: { type: graphql_1.GraphQLString }
    }
});
exports.ContactType = new graphql_1.GraphQLObjectType({
    name: "ContactType",
    description: "Información de contacto enviada por el cliente",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        lastname: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        location: { type: graphql_1.GraphQLString },
        reason: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        createdAt: { type: graphql_1.GraphQLString },
        updatedAt: { type: graphql_1.GraphQLString }
    }
});
exports.RateType = new graphql_1.GraphQLObjectType({
    name: "RateType",
    description: "Calificación de un usuario mostrada en los testimonios",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        testimonial: { type: graphql_1.GraphQLString },
        author: {
            type: exports.UserType,
            async resolve(parent) {
                return {
                    ...(await User_1.default.findById(parent.author).lean(true)),
                    password: null,
                    _id: null,
                    email: null,
                    roles: null
                };
            }
        },
        createdAt: { type: graphql_1.GraphQLString },
        updatedAt: { type: graphql_1.GraphQLString }
    }
});
//# sourceMappingURL=types.js.map