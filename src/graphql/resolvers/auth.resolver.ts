import { GraphQLFieldConfig, GraphQLList, GraphQLString  } from 'graphql'
import { sign } from 'jsonwebtoken'
import User from '../../models/User'
import Role from '../../models/Role'
import { isAuthenticated } from '../../middlewares/isAuthenticated'
import { isAuthorized } from '../../middlewares/isAuthorized'
import { JWT_SECRET } from '../../config'
import { emailRegExp } from '../../util/regExp'
import { encryptPassword, comparePassword } from '../../util/password'
import { Request } from 'express'

export const signUp: GraphQLFieldConfig<any, Request, {
    username: string,
    email: string,
    password: string,
    name: string,
    occupation: string,
    imageUrl: string,
    roles: string[],
}> = {
    type: GraphQLString,
    description: "Autenticación y registro para usuario no registrados",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
        occupation: { type: GraphQLString },
        roles: { type: new GraphQLList(GraphQLString), defaultValue: ["User"] }
    },
    async resolve(_, { username, email, occupation, password, imageUrl, roles }, ctx) {
        // ? Validations
        if (!username || !email || !occupation || !password) throw new Error("INFORMAIÓN INCOMPLETA")
        if (!emailRegExp.test(email)) throw new Error("EMAIL INVÁLIDO")

        // ? Hash password
        const hashedPassword = await encryptPassword(password)
        const newUser = new User({
            username,
            email,
            occupation,
            password: hashedPassword,
            imageUrl
        })

        // * Set the given role
        if (newUser && roles) {
            if (roles.some(r => r !== "User")) {
                try {
                    const authenticatedAdminId = isAuthenticated(ctx)
                    await isAuthorized(authenticatedAdminId, ["Admin"])
                } catch (err: any) {
                    throw new Error(err.message)
                }
            } 
            const foundRoles = await Role.find({ name: { $in: roles } })
            if (foundRoles.length === 0) throw new Error("NINGUN ROL ASIGNADO")
            newUser.roles = foundRoles.map(role => role._id)
            await newUser.save()

            // * Generate JWT
            return sign({ id: newUser._id }, JWT_SECRET, {
                expiresIn: 60 * 60 * 24
            })
        }
    }
}

export const signIn: GraphQLFieldConfig<any, any> = {
    type: GraphQLString,
    description: "Autenticación para usuarios ya registrados",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(_: any, { email, password }) {
        // ? Validate input
        if (!email || !password) throw new Error("INFORMAIÓN INCOMPLETA")
        if (!emailRegExp.test(email)) throw new Error("EMAIL INVÁLIDO")

        // * Find the user
        const foundUser = await User.findOne({ email })
        if (!foundUser) throw new Error("USUARIO NO ENCONTRADO")

        // * Check out the passwords
        if (!await comparePassword(password, foundUser.password)) throw new Error("CONTRASEÑA INCORRECTA")

        // * Generate JWT
        return sign({ id: foundUser._id }, JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        })
    }
}

