import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import moment from 'moment'

const Comment = ({ comment }) => {
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchUser = async () => {
            try{
                const res = await axiosRequest.get(`/user/${comment.userId}`)
                setUser(res.data)
            } catch(error) {
                console.log(error.message)
            }
        }
        fetchUser()
    }, [comment])

  return (
    <div className='flex p-4 items-center border-b dark:border-gray-600 text-sm'>
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.photo}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className='font-bold mr-2 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
          <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className='text-gray-500 pb-2'>{comment.content}</p>
      </div>
    </div>
  )
}

export default Comment