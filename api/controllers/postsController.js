import handleError from '../config/errorHandler.js'
import Post from '../models/postModel.js'

export const create = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(handleError(403, 'You are not allowed to create a post'))

  if (!req.body.title || !req.body.content)
    return next(handleError(400, 'Please fill in all required fields'))

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  })
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalPost = await Post.countDocuments() // total number of post in the document

    const now = new Date()

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    const lastMonthsPosts = await Post.countDocuments({
      createdAt: { $gt: oneMonthAgo },
    })

    res.status(200).json({
      posts,
      totalPost,
      lastMonthsPosts,
    })
  } catch (error) {
    next(error)
  }
}

// delete post functionality
export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(handleError(403, 'You are not allowed to delete this post'))

  try {
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json('Post deleted successfully')
  } catch (error) {
    next(error)
  }
}

// update post functionality
export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(handleError(403, 'You are not allowed to update this post'))

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (error) {
    next(error)
  }
}