"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const user_resolver_1 = require("./resolvers/user.resolver");
const auth_resolver_1 = require("./resolvers/auth.resolver");
const rate_resolver_1 = require("./resolvers/rate.resolver");
const contact_resolver_1 = require("./resolvers/contact.resolver");
const query = new graphql_1.GraphQLObjectType({
    name: 'QueryType',
    description: "Todas las consultas posibles",
    fields: {
        /* TEST */
        ping: {
            description: "Testear el funcionamiento",
            type: graphql_1.GraphQLString,
            resolve: () => 'pong'
        },
        /* USERS */
        users: user_resolver_1.users,
        user: user_resolver_1.user,
        /* CONTACT */
        contacts: contact_resolver_1.contacts,
        contact: contact_resolver_1.contact,
        /* RATES */
        rates: rate_resolver_1.rates,
        rate: rate_resolver_1.rate
    }
});
const mutation = new graphql_1.GraphQLObjectType({
    name: 'MutationType',
    description: "Todas las mutaciones posibles",
    fields: {
        /* USERS */
        signUp: auth_resolver_1.signUp,
        signIn: auth_resolver_1.signIn,
        updateUser: user_resolver_1.updateUser,
        deleteUser: user_resolver_1.deleteUser,
        submitContact: contact_resolver_1.submitContact,
        /* CONTACT */
        updateContact: contact_resolver_1.updateContact,
        deleteContact: contact_resolver_1.deleteContact,
        /* RATES */
        submitRate: rate_resolver_1.submitRate
    }
});
exports.schema = new graphql_1.GraphQLSchema({
    query,
    mutation
});
//# sourceMappingURL=schema.js.map