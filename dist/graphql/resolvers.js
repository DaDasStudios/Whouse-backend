"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserR = exports.usersR = void 0;
const graphql_1 = require("graphql");
const User_1 = __importDefault(require("../models/User"));
const validation_1 = __importDefault(require("../util/validation"));
const usersR = async () => {
    return await User_1.default.find();
};
exports.usersR = usersR;
const createUserR = async (_, args) => {
    const { username, email, password } = args;
    validation_1.default.checkEmpty([username, email, password], new graphql_1.GraphQLError("Uncompleted Input", {
        extensions: validation_1.default.createGraphQLExtension(400)
    }));
    validation_1.default.checkEmail(email, new graphql_1.GraphQLError("Invalid email", {
        extensions: validation_1.default.createGraphQLExtension(400)
    }));
    const newUser = new User_1.default(args);
    //return await newUser.save()
    return newUser;
};
exports.createUserR = createUserR;
//# sourceMappingURL=resolvers.js.map