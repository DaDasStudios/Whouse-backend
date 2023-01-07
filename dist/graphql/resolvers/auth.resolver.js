"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const graphql_1 = require("graphql");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = __importDefault(require("../../models/User"));
const Role_1 = __importDefault(require("../../models/Role"));
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAuthorized_1 = require("../../middlewares/isAuthorized");
const config_1 = require("../../config");
const regExp_1 = require("../../util/regExp");
const password_1 = require("../../util/password");
exports.signUp = {
    type: graphql_1.GraphQLString,
    description: "Autenticación y registro para usuario no registrados",
    args: {
        username: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        imageUrl: { type: graphql_1.GraphQLString },
        occupation: { type: graphql_1.GraphQLString },
        roles: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString), defaultValue: ["User"] }
    },
    async resolve(_, { username, email, occupation, password, imageUrl, roles }, ctx) {
        // ? Validations
        if (!username || !email || !occupation || !password)
            throw new Error("INFORMAIÓN INCOMPLETA");
        if (!regExp_1.emailRegExp.test(email))
            throw new Error("EMAIL INVÁLIDO");
        // ? Hash password
        const hashedPassword = await (0, password_1.encryptPassword)(password);
        const newUser = new User_1.default({
            username,
            email,
            occupation,
            password: hashedPassword,
            imageUrl
        });
        // * Set the given role
        if (newUser && roles) {
            if (roles.some(r => r !== "User")) {
                try {
                    const authenticatedAdminId = (0, isAuthenticated_1.isAuthenticated)(ctx);
                    await (0, isAuthorized_1.isAuthorized)(authenticatedAdminId, ["Admin"]);
                }
                catch (err) {
                    throw new Error(err.message);
                }
            }
            const foundRoles = await Role_1.default.find({ name: { $in: roles } });
            if (foundRoles.length === 0)
                throw new Error("NINGUN ROL ASIGNADO");
            newUser.roles = foundRoles.map(role => role._id);
            await newUser.save();
            // * Generate JWT
            return (0, jsonwebtoken_1.sign)({ id: newUser._id }, config_1.JWT_SECRET, {
                expiresIn: 60 * 60 * 24
            });
        }
    }
};
exports.signIn = {
    type: graphql_1.GraphQLString,
    description: "Autenticación para usuarios ya registrados",
    args: {
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString }
    },
    async resolve(_, { email, password }) {
        // ? Validate input
        if (!email || !password)
            throw new Error("INFORMAIÓN INCOMPLETA");
        if (!regExp_1.emailRegExp.test(email))
            throw new Error("EMAIL INVÁLIDO");
        // * Find the user
        const foundUser = await User_1.default.findOne({ email });
        if (!foundUser)
            throw new Error("USUARIO NO ENCONTRADO");
        // * Check out the passwords
        if (!await (0, password_1.comparePassword)(password, foundUser.password))
            throw new Error("CONTRASEÑA INCORRECTA");
        // * Generate JWT
        return (0, jsonwebtoken_1.sign)({ id: foundUser._id }, config_1.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        });
    }
};
//# sourceMappingURL=auth.resolver.js.map