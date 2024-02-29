import { Button, FloatingLabel, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Comments = ({ postId }) => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {}
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
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-tl-xl rounded-br-xl p-3"
        >
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
            <Button size={'sm'} outline gradientDuoTone={'pinkToOrange'}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Comments
