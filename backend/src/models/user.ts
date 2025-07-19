import mongoose from "mongoose";

type User = {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export const UserModel = mongoose.model("User", userSchema)