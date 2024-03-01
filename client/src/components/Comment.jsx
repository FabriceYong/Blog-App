import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import moment from 'moment'
import { FaThumbsUp, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({})
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosRequest.get(`/user/${comment.userId}`)
        setUser(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchUser()
  }, [comment])

  return (
    <div className="flex p-4 items-center border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.photo}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-2 text-xs truncate">
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className="flex items-center gap-4 border-t dark:border-gray-700 max-w-fit pt-2">
          <div className='flex items-center gap-1'>
            <button
              type="button"
              className={`text-gray-500 hover:text-blue-500 ${
                currentUser &&
                comment.likes.includes(currentUser._id) &&
                '!text-blue-500'
              }`}
              onClick={() => onLike(comment._id)}
            >
              <FaThumbsUp />
            </button>
              <p className='text-gray-400 text-sm'>{comment.numberOfLikes > 0 && comment.numberOfLikes + '' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}</p>
          </div>

          <button type="button" className="text-green-500 hover:text-green-600">
            <FaEdit />
          </button>
          <button type="button" className="text-red-500 hover:text-red-600 ">
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comment
