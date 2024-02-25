import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import { Modal, Table, Button, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiInformationCircle } from 'react-icons/hi'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'

const DashPosts = () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  const [userPosts, setUserPost] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // fetch user post using user id
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await axiosRequest.get(
          `/post/get-posts?userId=${currentUser._id}`
        )

        setUserPost(res.data.posts)

        if (res.data.posts.length < 9) {
          setShowMore(false)
        }
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
    if (currentUser.isAdmin) fetchPosts()
  }, [currentUser._id])

  // show more functionality
  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await axiosRequest.get(
        `/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`
      )

        setUserPost((prev) => [...prev, ...res.data.posts])
        if (res.data.posts.length < 9) setShowMore(false)
      
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const res = await axiosRequest.delete(
        `/post/delete-post/${postIdToDelete}/${currentUser._id}`
      )

      if (res.data.success === false) {
        setError(res.data.message)
      } else {
        setUserPost((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        )
      }
    } catch (error) {
      setError(error.response.data)
    }
  }

  return (
    <div className="dark:text-gray-200 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <div className='flex items-center gap-3 my-4'>
          <Spinner color='purple' aria-label="Extra large spinner example Purple" size="xl" />
          <span className='font-medium text-lg text-purple-600 dark:text-purple-300'>Loading...</span>
        </div>
      ) : currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500 rounded-[4px]"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium hover:underline text-gray-800 dark:text-gray-100"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell className="cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setPostIdToDelete(post._id)
                      }}
                      className="font-medium text-red-500 hover:underline"
                    >
                      <MdDelete className='text-lg'/>
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 hover:underline">
                        <FaEdit className='text-lg' />
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {userPosts.length > 9 && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 text-3xl font-medium">
          Sorry! No posts found yet
        </p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'md'}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiInformationCircle className="text-5xl mx-auto text-red-700" />
            <p className="my-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </p>
            <div className="flex items-center justify-center gap-5">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts

// install tailwind-scrollbar
