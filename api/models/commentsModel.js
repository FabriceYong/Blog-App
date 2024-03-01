import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required:true
    },
    userId: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
},{timestamps: true})

const Comment = mongoose.model('Comment', CommentsSchema)
export default Comment