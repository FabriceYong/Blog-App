import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import { Modal, Table, Button, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiInformationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

const DashUsers = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  // fetch user post using user id
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await axiosRequest.get(`/user/get-users`)

        setUsers(res.data.users)

        if (res.data.users.length < 9) {
          setShowMore(false)
        }
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
    if (currentUser.isAdmin) fetchUsers()
  }, [currentUser._id])

  // show more functionality
  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await axiosRequest.get(
        `/user/get-users?startIndex=${startIndex}`
      )

        setUsers((prev) => [...prev, ...res.data.users])
        if (res.data.users.length < 9) setShowMore(false)
  
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      setDeleteSuccess(false)
      const res = await axiosRequest.delete(
        `/user/delete/${userIdToDelete}`
      )

        setUsers((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        )
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
      ) : currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.photo}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}</Table.Cell>
                  <Table.Cell className="cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setUserIdToDelete(user._id)
                      }}
                      className="font-medium text-red-500 hover:underline"
                    >
                      <MdDelete className='text-lg'/>
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {users.length > 9 && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-3xl font-medium">
          Sorry! No users found yet
        </p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'md'}
        className='dark:text-gray-200'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiInformationCircle className="text-5xl mx-auto text-red-700" />
            <p className="my-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </p>
            <div className="flex items-center justify-center gap-5">
              <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers

// install tailwind-scrollbar
