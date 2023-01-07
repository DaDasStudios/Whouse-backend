"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const graphql_1 = require("graphql");
const resolvers_1 = require("./resolvers");
const types_1 = require("./types");
exports.createUser = {
    type: types_1.UserType,
    description: "Create a simple user without password encrypting but needs roles",
    args: {
        username: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString }
    },
    resolve: resolvers_1.createUserR
};
//# sourceMappingURL=mutations.js.map