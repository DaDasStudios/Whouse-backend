import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { updateUser, deleteUser, user, users } from './resolvers/user.resolver'
import { signIn, signUp } from './resolvers/auth.resolver'
import { submitRate, rates, rate } from './resolvers/rate.resolver'
import { submitContact, contacts, contact, updateContact, deleteContact } from './resolvers/contact.resolver'

const query = new GraphQLObjectType({
    name: 'QueryType',
    description: "Todas las consultas posibles",
    fields: {
        /* TEST */
        ping: {
            description: "Testear el funcionamiento",
            type: GraphQLString,
            resolve: () => 'pong'
        },
        /* USERS */
        users,
        user,
        /* CONTACT */
        contacts,
        contact,
        /* RATES */
        rates,
        rate
    }
})

const mutation = new GraphQLObjectType({
    name: 'MutationType',
    description: "Todas las mutaciones posibles",
    fields: {
        /* USERS */
        signUp,
        signIn,
        updateUser,
        deleteUser,
        submitContact,
        /* CONTACT */
        updateContact,
        deleteContact,
        /* RATES */
        submitRate
    } 
})

export const schema = new GraphQLSchema({
    query,
    mutation
})
