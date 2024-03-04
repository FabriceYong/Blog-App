import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import moment from 'moment'
import { FaThumbsUp, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Alert, Button, Textarea } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosRequest.get(`/user/${comment.userId}` )

        setUser(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchUser()
  }, [comment])

  const handleEdit = async () => {
    setIsEditing(true)
    setEditedContent(comment.content)
  }

  const handleSave = async () => {
    try {
      setLoading(false)
      const res = await axiosRequest.put(`/comment/edit-comment/${comment._id}`, { content: editedContent })

      setIsEditing(false)
      setLoading(false)
      onEdit(comment, editedContent)

    } catch (error) {
      setError('There was an error editing the comment.')
      setLoading(false)
    }
  }

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
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center justify-end gap-4 text-xs">
              <Button
                type="button"
                size={'sm'}
                gradientDuoTone={'purpleToPink'}
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </Button>
              <Button
                type="button"
                size={'sm'}
                color="failure"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center gap-4 border-t dark:border-gray-700 max-w-fit pt-2">
              <div className="flex items-center gap-1">
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
                <p className="text-gray-400 text-sm">
                  {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                      '' +
                      (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                </p>
              </div>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-green-500 hover:text-green-600"
                    onClick={handleEdit}
                  >
                    <FaEdit />
                  </button>
                )}

              <button
                type="button"
                className="text-red-500 hover:text-red-600 "
                onClick={() => onDelete(comment._id)}
              >
                <MdDelete />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Comment
