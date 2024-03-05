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

export const getPostComments = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 5
    const sortDirection = req.query.sort === 'asc' ? 1 : -1

    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: sortDirection })
      .limit(limit)
      .skip(startIndex)

    // const totalComments = await Comment.countDocuments()

    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return next(handleError(404, 'Comment not found!'))
    // check if a user has already like the comment
    const userIndex = comment.likes.indexOf(req.user.id)
    if (userIndex === -1) {
      comment.numberOfLikes += 1 // add a like to the comment
      comment.likes.push(req.user.id)
    } else {
      comment.likes.splice(userIndex, 1)
      comment.numberOfLikes -= 1 //remove like from the comment
    }
    await comment.save()
    res.status(200).json(comment)
  } catch (err) {
    next(err)
  }
}

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment) return next(handleError(404, 'Comment not found'))

    if((comment.userId !== req.user.id) && !req.user.isAdmin) return next(handleError(403, 'You are not allowed to edit this comment'))

    const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
      content: req.body.content,
    }, {new: true})

    res.status(200).json(editedComment)
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if(!comment) return next(handleError(404, 'Comment not found'))

    if((comment.userId !== req.user.id) && !req.user.isAmin) return next(handleError(403, 'You are not allowed to delete this comment'))

    await Comment.findByIdAndDelete(req.params.commentId)

    res.status(200).json('Comment deleted successfully')
  } catch (error) {
    next(error)
  }
}

export const getComments = async (req, res, next) => {
  if(!req.user.isAdmin) return next(handleError(403, "You're not allowed to get all comments"))
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === 'desc' ? -1 : 1

    const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit)

    const totalComments = await Comment.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() -1, now.getDate())
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gt: oneMonthAgo }})

    res.status(200).json({ comments, totalComments, lastMonthComments})
  } catch (error) {
    next(error)
  }
}