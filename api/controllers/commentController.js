import handleError from '../config/errorHandler.js'
import Comment from '../models/commentsModel.js'

export const createComment = async (req, res, next) => {
  try {
    // const { content, postId, userId } = req.body
    if (req.body.userId !== req.user.id)
      return next(handleError(403, 'Unauthorized'))

    const newComment = new Comment({
      content: req.body.content,
      postId: req.body.postId,
      userId: req.body.userId,
    })

    const savedComment = await newComment.save()
    res.status(200).json(savedComment)
  } catch (error) {
    next(error)
  }
}

export const getComments = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 5
    const sortDirection = req.query.sort === 'asc' ? 1 : -1

    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: sortDirection})
      .limit(limit)
      .skip(startIndex)

    // const totalComments = await Comment.countDocuments()

    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}