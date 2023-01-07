import { Request } from 'express'
import { GraphQLFieldConfig, GraphQLID, GraphQLString, GraphQLList } from 'graphql'
import User from '../../models/User'
import Role from '../../models/Role'
import { emailRegExp } from '../../util/regExp'
import { UserType } from '../types'
import { isAuthenticated } from '../../middlewares/isAuthenticated'
import { isAuthorized } from '../../middlewares/isAuthorized'

// ! QUERY RESOLVERS
export const users: GraphQLFieldConfig<any, any> = {
    description: "Obtener todas las cuentas de los usuario - Requiere rol de administrador",
    type: new GraphQLList(UserType),
    async resolve(_, __, ctx: Request) {
        try {
            const id = isAuthenticated(ctx)
            const authorized = await isAuthorized(id, ["Admin"])
            if (authorized) return await User.find()
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}

export const user: GraphQLFieldConfig<any, any> = {
    description: "Obtener un solo usuario - Requiere rol de administrador",
    type: UserType,
    args: {
        id: { type: GraphQLID }
    },
    async resolve(_, { id }, ctx: Request) {
        try {
            const authenticatedUserId = isAuthenticated(ctx)
            const authorized = await isAuthorized(authenticatedUserId, ["Admin"])
            if (authorized) return await User.findById(id)
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}

// ! MUTATION RESOLVERS
export const updateUser: GraphQLFieldConfig<any, any> = {
    type: UserType,
    description: "Actualizar los datos de un usuario ya registrado",
    args: {
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        occupation: { type: GraphQLString },
    },
    async resolve(_: any, { id, username, email, imageUrl, occupation }, ctx: Request) {
        try {
            // ? Check out the permission
            const authenticatedUserId = isAuthenticated(ctx)
            const isUserOrAdmin = await isAuthorized(authenticatedUserId, ["User", "Admin"])

            if (isUserOrAdmin) {
                // * Find a user in order to verify if it's an admin or a normal user
                const foundUser = await User.findById(authenticatedUserId)

                // * Find the user's roles
                const roles = await Role.find({ _id: { $in: foundUser?.roles } })

                if (
                    // * In case it is user, the user who is trying to update information must be himself
                    (roles.some(r => r.name === "User") && foundUser?._id.toString() === id)
                    ||
                    // * In case it is an Admin, just continue with the updating
                    (roles.some(r => r.name === "Admin"))
                ) {
                    if (email && !emailRegExp.test(email)) throw new Error("EMAIL INVÁLIDO")
                    return await User.findByIdAndUpdate(id, { username, email, imageUrl, occupation }, { new: true })
                }
            }
            throw new Error('USUARIO NO AUTORIZADO')
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}

export const deleteUser: GraphQLFieldConfig<any, any> = {
    type: UserType,
    description: "Eliminar un usuario existente - Requiere rol de administrador",
    args: {
        id: { type: GraphQLID }
    },
    async resolve(_: any, { id }, ctx: Request) {
        try {
            // ? Check out the permission
            const authenticatedUserId = isAuthenticated(ctx)
            const isAdmin = await isAuthorized(authenticatedUserId, ["Admin"])
            if (isAdmin) {
                return await User.findByIdAndDelete(id)
            }

        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}
