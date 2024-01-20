import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import handleError from '../config/errorHandler.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  })

  if(!req.body.username || !req.body.email || !req.body.password || req.body.username === '' || req.body.email === '' || req.body.password === '') return next(handleError(401, 'All fields are required')) 

  try {
    // if user already exists, return error message
    const user = await User.findOne({ email: req.body.email })
    if(user) return next(handleError(500, 'User already exists, Please log in or create a different user account'))

    // if username already exists, return error message
    const username = await User.findOne({ username: req.body.username })
    if(username) return next(handleError(500, 'User name already taken, Please enter a different username'))

    const savedUser = await newUser.save()
    res.status(200).json(savedUser)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        const verifyPassword = bcrypt.compareSync(req.body.password, user.password)
        if(verifyPassword) {
            // token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            // user cookie 
            res.cookie('access_token', token, { httpOnly: true })
            const { password, ...userDoc } = user._doc
            res.status(200).json(userDoc)
        } else {
            return next(handleError(403, "Invalid credentials"))
        }
    } else {
        return next(handleError(404, "User not found"))
    }
  } catch (err) {
    next(err)
  }
}

export const logout = (req, res, next) => {
  res.clearCookie('access_token', { sameSite: 'none', secure: true}).status(200).json({ message: 'Logged out successfully' })
}
