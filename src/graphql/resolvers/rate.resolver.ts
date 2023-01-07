import { GraphQLFieldConfig, GraphQLString, GraphQLList, GraphQLID } from 'graphql'
import { Request } from 'express'
import Rate from '../../models/Rate'
import Role from '../../models/Role'
import { isAuthenticated } from '../../middlewares/isAuthenticated'
import { isAuthorized } from '../../middlewares/isAuthorized'
import { RateType } from '../types'

// ! QUERY RESOLVER
export const rates: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(RateType),
    description: "Una lista completa de todos los testimonios",
    async resolve() {
        return await Rate.find()
    }
}

export const rate: GraphQLFieldConfig<any, any> = {
    type: RateType,
    description: "Un solo testimonio que puede ser solicitado por el autor - Requiere autenticación o rol de administrador",
    args: {
        id: { type: GraphQLID },
    },
    async resolve(_, { id }, ctx: Request) {
        try {
            // ? Permission validations
            const authenticatedUserId = isAuthenticated(ctx)
            const authorizedSubject = await isAuthorized(authenticatedUserId, ["User", "Admin"])

            // * Find the roles. If the client has "Admin" role, then he can access to the rate, but needs ID
            const foundRoles = await Role.find({ _id: { $in: authorizedSubject?.roles } })
            if (foundRoles.map(role => role.name).includes("Admin")) {
                if (!id) throw new Error("ID NO PROPORCIONADO")
                return await Rate.findById(id)
            // * If client has "User" role, he will get the rate with the ID of the authenticated user
            } else {
                return await Rate.findOne({ author: authorizedSubject?._id })
            }
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}


// ! MUTATION RESOLVER
export const submitRate: GraphQLFieldConfig<any, any> = {
    type: RateType,
    description: "Crear un testimonio o actualizarlo si ya ha sido creado - Requiere autenticación",
    args: {
        testimonial: { type: GraphQLString }
    },
    async resolve(_, { testimonial }, ctx: Request) {
        try {
            const userId = isAuthenticated(ctx)
            const foundUser = await isAuthorized(userId, ["User"])
            const foundRate = await Rate.findOne({ author: foundUser?._id })

            // ? Validations
            if (!testimonial) throw new Error("INFORMACIÓN INCOMPLETA")

            // * Create the rate for first time
            if (foundRate === null) {
                const newRate = new Rate({ testimonial, author: foundUser?._id })
                return await newRate.save()
                // * Update the created one
            } else {
                return await Rate.findByIdAndUpdate(foundRate?._id, { testimonial }, { new: true })
            }

        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}