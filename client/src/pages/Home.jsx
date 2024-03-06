import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import axiosRequest from '../utils/axiosRequest'
import PostCard from '../components/PostCard'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
         const res = await axiosRequest.get('/post/get-posts')

        setPosts(res.data.posts)
        setError(null)
        setLoading(false)
      } catch (error) {
        setError('Sorry, An error occurred while fetching posts')
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="dark:text-gray-200 mb-10">
      <div className="flex flex-col gap-6 px-4 p-28 mx-auto items-center">
        <h1 className="text-3xl font-bold lg:text-6xl sm:text-5xl">Welcome to my blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics ranging
          from web development, software engineering, programming languages, to
          a other topics on the past, present and future of our everyday lives
        </p>
      <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
        View all posts
      </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7"></div>
      {posts?.length > 0 && (
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
          <div className="flex flex-wrap gap-4 justify-center">
             {posts.map((post) => (
            <PostCard key={post._id} post={post} />
           ))}
          </div>
          <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>View all search</Link>
        </div>
      )}
    </div>
  )
}

export default Home