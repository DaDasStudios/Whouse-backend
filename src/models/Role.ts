import { Schema, model } from 'mongoose'

const RoleSchema = new Schema({
    name: {
        type: String
    }
},
    {
        versionKey: false
    })

export default model("Role", RoleSchema)