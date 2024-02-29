import handleError from "../config/errorHandler.js"

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body
        if(userId !== req.user.id) return next(handleError(403, 'Unauthorized'))

        const newComment = new Comment({
            content, postId, userId,
        })

        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
} 