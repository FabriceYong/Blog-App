import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosRequest from '../utils/axiosRequest'
import { Button, Spinner, Alert } from 'flowbite-react'
import CallToAction from '../components/CallToAction'
import Comments from '../components/Comments'
import { HiInformationCircle } from 'react-icons/hi'
import PostCard from '../components/PostCard'

const PostPage = () => {
  const { postSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [post, setPost] = useState(null)
  const [showMoreText, setShowMoreText] = useState(false)
  const [createdBy, setCreatedBy] = useState({})
  const [recentPosts, setRecentPosts] = useState(null)
  const [fetchRecentPostsError, setFetchRecentPostsError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await axiosRequest.get(`/post/get-posts?slug=${postSlug}`)

        setPost(res.data.posts[0])
        setError(false)
        setLoading(false)
      } catch (error) {
        setError(error.response?.data || 'Something went wrong!')
        setLoading(false)
      }
    }

    fetchPost()
  }, [postSlug])

  useEffect(() => {
    const createdBy = async () => {
      try {
        const res = await axiosRequest.get(`/user/${post.userId}`)
        setCreatedBy(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    createdBy()
  }, [post])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true)
        const res = await axiosRequest.get(`/post/get-posts?limit=3`)
        setRecentPosts(res.data.posts)
        setLoading(false)
        setFetchRecentPostsError(null)
      } catch (error) {
        setFetchRecentPostsError('Sorry! No recent posts found')
      }
    }
    fetchRecentPosts()
  }, [])

  return (
    <div className="dark:text-gray-200">
      {loading ? (
        <div className="flex items-center gap-3 my-4 justify-center min-h-screen">
          <Spinner
            color="purple"
            aria-label="Extra large spinner example Purple"
            size="xl"
          />
        </div>
      ) : error ? (
        <p className="text-center py-6 text-lg text-red-500 font-medium">
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setError(null)}
            className="max-w-3xl mx-auto text-wrap"
          >
            <span className="font-bold mr-2">Info alert!</span><span>Could not load this post, refresh or try again later</span> 
          </Alert>
        </p>
      ) : (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
          <h1 className="text-6xl mt-10 p-3 text-center font-serif max-w-3xl mx-auto lg:text-4xl capitalize">
            {post?.title}
          </h1>
          <Link
            to={`/search?category=${post?.category}`}
            className="self-center my-5"
          >
            <Button color="failure" outline pill size={'xs'}>
              {post?.category}
            </Button>
          </Link>
          <img
            src={post?.image}
            alt={post?.title}
            className="mt-5 p-3 max-h-[600px] w-full object-cover"
          />
          <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full mx-w-2xl text-xs font-medium">
            <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
            {createdBy && (
              <span className="italic">
                create by: @
                <Link to={'/dashboard?tab=profile'}>{createdBy.username}</Link>
              </span>
            )}
            <span className="italic">
              {(post?.content.length / 1000).toFixed(0)}mins read
            </span>
          </div>
          <div className="flex flex-col items-center">
            {showMoreText ? (
              <div
                className="p-3 max-w-2xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{
                  __html: post?.content,
                }}
              ></div>
            ) : (
              <div
                className="p-3 max-w-2xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{
                  __html: post?.content.slice(0, 2000) + `<span>...</span>`,
                }}
              ></div>
            )}
            {!showMoreText && (
              <span
                onClick={() => setShowMoreText(true)}
                className="uppercase font-medium text-blue-500 cursor-pointer opacity-80"
              >
                continue reading...
              </span>
            )}
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
          </div>
          <Comments postId={post?._id} />

          <div className="flex flex-col justify-center, items-center my-5">
            <h1 className="font-semibold text-3xl">Recent articles</h1>
            {loading ? (
              <div className="flex items-center gap-3 my-4 justify-center min-h-screen">
                <Spinner
                  color="purple"
                  aria-label="Extra large spinner example Purple"
                  size="xl"
                />
              </div>
            ) : fetchRecentPostsError ? (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                onDismiss={() => setFetchRecentPostsError(null)}
                className="max-w-3xl mx-auto text-wrap"
              >
                <span className="font-medium">Info alert!</span><span>{fetchRecentPostsError.message}</span>
              </Alert>
            ) : (
              <div className="flex flex-wrap gap-5 mt-5 justify-center">
                {recentPosts && recentPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  )
}

export default PostPage
