import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import { Modal, Table, Button, Spinner, Alert } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiInformationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

const DashComments = () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  // fetch user post using user id
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const res = await axiosRequest.get(`/comment/get-comments`)

        setComments(res.data.comments)

        if (res.data.comments.length < 9) {
          setShowMore(false)
        }
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
    if (currentUser.isAdmin) fetchComments()
  }, [currentUser._id])

  // show more functionality
  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await axiosRequest.get(
        `/comment/get-comments?startIndex=${startIndex}`
      )

      setComments((prev) => [...prev, ...res.data.comments])
      if (res.data.comments.length > 9) setShowMore(true)
      setShowMore(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      setDeleteSuccess(false)
      const res = await axiosRequest.delete(`/comment/delete-comment/${commentIdToDelete}`)

      setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
      setShowModal(false)
      setDeleteSuccess(true)
    } catch (error) {
      setError(error.response.data)
    }
  }

  return (
    <div className="dark:text-gray-200 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <div className="flex items-center gap-3 my-4">
          <Spinner
            color="purple"
            aria-label="Extra large spinner example Purple"
            size="xl"
          />
          <span className="font-medium text-lg text-purple-600 dark:text-purple-300">
            Loading...
          </span>
        </div>
      ) : currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className=''>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell className="cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setCommentIdToDelete(comment._id)
                      }}
                      className="font-medium text-red-500"
                    >
                      <MdDelete className="text-lg" />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7 hover:underline"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <span className="text-center py-6 text-lg">
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setError(null)}
            className="max-w-3xl mx-auto text-wrap"
          >
            <span className="font-bold mr-2">Info alert!</span>
            <span>Sorry! no comments found yet, refresh or try again later</span>
          </Alert>
        </span>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'md'}
        className="dark:text-gray-200"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiInformationCircle className="text-5xl mx-auto text-red-700" />
            <p className="my-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex items-center justify-center gap-5">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" outline onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComments

// install tailwind-scrollbar
