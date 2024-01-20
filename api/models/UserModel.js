import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)
export default User
