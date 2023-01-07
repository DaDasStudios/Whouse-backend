"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const graphql_1 = require("graphql");
const resolvers_1 = require("./resolvers");
const types_1 = require("./types");
exports.users = {
    description: "Crear nueva cuenta",
    type: new graphql_1.GraphQLList(types_1.UserType),
    resolve: resolvers_1.usersR
};
//# sourceMappingURL=queries.js.map