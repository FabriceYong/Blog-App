import React, { useEffect, useState } from 'react'
import axiosRequest from '../utils/axiosRequest'
import { HiArrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { FaComment } from 'react-icons/fa'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

const DashboardComponent = () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [posts, setPosts] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthComments, setLastMonthComments] = useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0)

  useEffect(() => {
    // fetch users
    const fetchUsers = async () => {
      try {
        const res = await axiosRequest.get('/user/get-users?limit=5')
        setUsers(res.data.users)
        setTotalUsers(res.data.totalUsers)
        setLastMonthUsers(res.data.lastMonthUsers)
      } catch (error) {
        console.log(error.message)
      }
    }

    // fetch comments
    const fetchComments = async () => {
      try {
        const res = await axiosRequest.get('/comment/get-comments?limit=5')
        setComments(res.data.comments)
        setLastMonthComments(res.data.lastMonthComments)
        setTotalComments(res.data.totalComments)
      } catch (error) {
        console.log(error.message)
      }
    }

    // fetch posts
    const fetchPosts = async () => {
      try {
        const res = await axiosRequest.get('/post/get-posts?limit=5')
        setPosts(res.data.posts)
        setTotalPosts(res.data.totalPosts)
        setLastMonthPosts(res.data.lastMonthPosts)
      } catch (error) {
        console.log(error.message)
      }
    }

    if (currentUser.isAdmin) {
      fetchComments()
      fetchPosts()
      fetchUsers()
    }
  }, [currentUser._id])

  return (
    <div className="p-3 md:mx-auto dark:text-gray-200 mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {/* users */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase dark:text-gray-300">
                Total Users
              </h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 rounded-full text-5xl p-3 shadow-lg text-gray-200" />
          </div>
          <div className="flex gap-2 text-sm">
            {lastMonthUsers > 0 && (
              <span className="text-green-500 flex items-center">
                {lastMonthUsers}
                <HiArrowUp />
              </span>
            )}
            <div className="text-gray-500 dark:text-gray-300">Last Month</div>
          </div>
        </div>

        {/* posts */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase dark:text-gray-300">
                Total Posts
              </h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-orange-600 rounded-full text-5xl p-3 shadow-lg text-gray-200" />
          </div>
          <div className="flex gap-2 text-sm">
            {lastMonthPosts > 0 && (
              <span className="text-green-500 flex items-center">
                {lastMonthPosts}
                <HiArrowUp />
              </span>
            )}
            <div className="text-gray-500 dark:text-gray-300">Last Month</div>
          </div>
        </div>

        {/* comments */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase dark:text-gray-300">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <FaComment className="bg-yellow-600 rounded-full text-5xl p-3 shadow-lg text-gray-200" />
          </div>
          <div className="flex gap-2 text-sm">
            {lastMonthComments > 0 && (
              <span className="text-green-500 flex items-center">
                {lastMonthComments}
                <HiArrowUp />
              </span>
            )}
            <div className="text-gray-500 dark:text-gray-300">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mx-auto justify-center">
        {/* users table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent Users</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User's image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user?._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user?.photo}
                        alt={user?.username}
                        className="w-10 h-10 rounded-full bg-gray-500 object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell>{user?.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* posts table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent Posts</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post?._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Link to={`/post/${post?.slug}`}>
                        <img
                          src={post?.image}
                          alt={post?.title}
                          className="w-14 h-10 rounded-md bg-gray-500 object-cover"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="w-96">
                      <Link
                        to={`/post/${post.slug}`}
                        className="hover:underline"
                      >
                        {post?.title}
                      </Link>
                    </Table.Cell>

                    <Table.Cell className="w-5">
                      <Link
                        to={`/post/${post.category}`}
                        className="hover:underline"
                      >
                        {post.category}
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* comments table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent Comments</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment?._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96 line-clamp-2">
                      {comment?.content}
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DashboardComponent
