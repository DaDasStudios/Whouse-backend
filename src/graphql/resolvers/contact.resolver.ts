import { GraphQLFieldConfig, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLList } from 'graphql'
import { Request } from 'express'
import Contact from '../../models/Contact'
import { ContactType } from '../types'
import { isAuthenticated } from '../../middlewares/isAuthenticated'
import { isAuthorized } from '../../middlewares/isAuthorized'
import { emailRegExp } from '../../util/regExp'

// ! QUERY RESOLVERS

export const contacts: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(ContactType),
    description: "La lista completa de intento de contacto del cliente - Requiere rol de administrador",
    async resolve(parent, args, ctx: Request) {
        try {
            const authenticatedAdminId = isAuthenticated(ctx)
            await isAuthorized(authenticatedAdminId, ["Admin"])
            return await Contact.find()
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}

export const contact: GraphQLFieldConfig<any, any> = {
    type: ContactType,
    description: "Un intento contacto identificado un ID - Requiere rol de administrador",
    args: {
        id: { type: GraphQLID },
    },
    async resolve(parent, { id }, ctx: Request) {
        try {
            const authenticatedAdminId = isAuthenticated(ctx)
            await isAuthorized(authenticatedAdminId, ["Admin"])
            return await Contact.findById(id)
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}

// ! MUTATION RESOLVERS

export const submitContact: GraphQLFieldConfig<any, any> = {
    type: new GraphQLObjectType({
        name: "ResponseContactType",
        description: "Respuesta del servidor a una petición de contacto",
        fields: {
            success: { type: GraphQLBoolean },
            data: { type: ContactType }
        }
    }),
    description: "Envío de información de contacto desde el cliente",
    args: {
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        location: { type: GraphQLString },
        reason: { type: GraphQLString },
        description: { type: GraphQLString },
    },
    async resolve(_: any, { name, lastname, email, location, reason, description }) {
        // ? Validations
        if (!name || !lastname || !email || !location || !reason || !description) throw new Error("INFORMACIÓN INCOMPLETA")
        if (!emailRegExp.test(email)) throw new Error("EMAIL INVÁLIDO")

        const newContactation = new Contact({ name, lastname, email, location, description, reason })
        const savedContact = await newContactation.save()
        return {
            success: Boolean(savedContact),
            data: newContactation
        }
    }
}

export const updateContact: GraphQLFieldConfig<any, any> = {
    type: ContactType,
    description: "Actualizar la información de intento de contacto - Requiere rol de administrador",
    args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        location: { type: GraphQLString },
        reason: { type: GraphQLString },
        description: { type: GraphQLString },
    },
    async resolve(parent, { id, name, lastname, email, location, reason, description }, ctx: Request) {
        try {
            const authenticatedAdminId = isAuthenticated(ctx)
            await isAuthorized(authenticatedAdminId, ["Admin"])
            return await Contact.findByIdAndUpdate(id, { name, lastname, email, location, reason, description }, { new: true })
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}

export const deleteContact: GraphQLFieldConfig<any, any> = {
    type: ContactType,
    description: "Eliminar la información de contacto de uno determinado - Requiere rol de administrador",
    args: {
        id: { type: GraphQLID },
    },
    async resolve(parent, { id }, ctx: Request) {
        try {
            const authenticatedAdminId = isAuthenticated(ctx)
            await isAuthorized(authenticatedAdminId, ["Admin"])
            return await Contact.findOneAndDelete(id)
        } catch (err: any) {
            throw new Error(err.message)
        }
    }
}