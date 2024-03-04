import { Alert, Button, FloatingLabel, Textarea, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosRequest from '../utils/axiosRequest'
import { HiInformationCircle } from 'react-icons/hi'
import Comment from './Comment'

const Comments = ({ postId }) => {
  const navigate = useNavigate()
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchCommentsError, setFetchCommentsError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (comment.length > 200) return

    try {
      setLoading(true)
      const res = await axiosRequest.post('/comment/create-comment', {
        content: comment,
        postId,
        userId: currentUser._id,
      })

      setComment('')
      setLoading(false)
      setError(null)
      setComments([res.data, ...comments])
    } catch (error) {
      setError(error.response?.data || 'Something went wrong!')
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const res = await axiosRequest.get(`/comment/get-comments/${postId}`)
        setComments(res.data)

        setFetchCommentsError(null)
        setLoading(false)
      } catch (error) {
        setFetchCommentsError(error.response?.data || 'Could not find comments')
        setLoading(false)
      }
    }
    fetchComments()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/login')
        return
      }
      const res = await axiosRequest.put(`comment/like-comment/${commentId}`)

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.data.likes,
                numberOfLikes: res.data.likes.length,
              }
            : comments
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (comment, editedContent) => {
    setComments(comments.map((comm) => comm._id === comment._id ? { ...comm, content: editedContent} : comm ))
  }

  return (
    <div>
      <div className="mb-4 max-w-3xl flex flex-col items-center w-full p-3">
        {currentUser ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <Link to={'/dashboard?tab=profile'}>
              <img
                src={currentUser.photo}
                alt={currentUser.username}
                className="h-6 w-6 rounded-full opacity-80"
              />
            </Link>
            <Link to={'/dashboard?tab=profile'} className="hover:text-cyan-500">
              @{currentUser.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm">
            <p>
              <Link className="hover:underline text-blue-500" to={'/signin'}>
                Sign in
              </Link>{' '}
              to leave a comment
            </p>
          </div>
        )}
      </div>
      {currentUser && (
        <form
          className="border border-teal-500 rounded-tl-xl rounded-br-xl p-3 my-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <Alert
              color="failure"
              icon={HiInformationCircle}
              onDismiss={() => setError(null)}
            >
              <span className="font-medium">Info alert!</span> {error.message}
            </Alert>
          )}
          <Textarea
            value={comment}
            placeholder="Leave a comment..."
            rows={3}
            maxLength={'200'}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button
              type="submit"
              size={'sm'}
              outline
              disabled={loading}
              gradientDuoTone={'pinkToOrange'}
            >
              Submit
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-3 my-4 justify-center min-h-screen">
          <Spinner
            color="purple"
            aria-label="Extra large spinner example Purple"
            size="xl"
          />
        </div>
      ) : fetchCommentsError ? (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          onDismiss={() => setFetchCommentsError(null)}
        >
          <span className="font-medium">Info alert!</span>{' '}
          {fetchCommentsError.message}
        </Alert>
      ) : (
        <div className="">
          {comments.length <= 0 ? (
            <Alert
              color="warning"
              icon={HiInformationCircle}
              onDismiss={() => setFetchCommentsError(null)}
            >
              <span className="font-medium">Info alert!</span> No comments yet!
            </Alert>
          ) : (
            <>
              <div className="text-sm my-5 flex items-center gap-1">
                <p>Comments</p>
                <div className="border border-gray-400 py-1 px-2 rounded-sm">
                  <p>{comments.length}</p>
                </div>
              </div>
              {comments.map((comment) => {
                return (
                  <Comment
                    comment={comment}
                    key={comment._id}
                    onLike={handleLike}
                    onEdit={handleEdit}
                  />
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Comments
