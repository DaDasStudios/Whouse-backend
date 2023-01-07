import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    roles: [{
        ref: "Role",
        type: Schema.Types.ObjectId,
        required: false
    }]
},
    {
        versionKey: false,
        timestamps: true,
    }
)

export default model("User", UserSchema, "users")