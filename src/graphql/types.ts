import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql'
import User from '../models/User'

export const UserType = new GraphQLObjectType({
    name: "UserType",
    description: "Usuario tomado desde la base de datos",
    fields: {
        _id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        occupation: { type: GraphQLString },
        roles: { type: new GraphQLList(GraphQLID) },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})

export const ContactType = new GraphQLObjectType({
    name: "ContactType",
    description: "Información de contacto enviada por el cliente",
    fields: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        location: { type: GraphQLString },
        reason: { type: GraphQLString },
        description: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})

export const RateType = new GraphQLObjectType({
    name: "RateType",
    description: "Calificación de un usuario mostrada en los testimonios",
    fields: {
        _id: { type: GraphQLID },
        testimonial: { type: GraphQLString },
        author: {
            type: UserType,
            async resolve(parent: {
                testimonial: string,
                author: string,
                _id: string,
            }) {
                return {
                    ...(await User.findById(parent.author).lean(true)),
                    password: null,
                    _id: null,
                    email: null,
                    roles: null
                }
            }
        },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})

