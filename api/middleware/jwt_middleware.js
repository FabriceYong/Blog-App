import jwt from 'jsonwebtoken'
import handleError from '../config/errorHandler.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if(!token) return next(handleError(401, 'You are not authenticated'))

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if(err) return next(handleError(401, 'Invalid token'))

        req.user = payload
        next()
    })
}