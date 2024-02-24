import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosRequest from '../utils/axiosRequest'
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction'

const PostPage = () => {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [post, setPost] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try{
                setLoading(true)
                const res = await axiosRequest.get(`/post/get-posts?slug=${postSlug}`)

                setPost(res.data.posts[0])
                setError(false)
                setLoading(false)

            }catch(error){
                setError(error.response.data)
                setLoading(false)
            }
        }

        fetchPost()
    }, [postSlug])
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
        <p className="text-center text-gray-600 text-3xl font-medium">
          Sorry? There was an error fetching the post, refresh or try again
          later
        </p>
      ) : (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
          <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
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
            <span className="italic">
              {(post?.content.length / 1000).toFixed(0)}mins read
            </span>
          </div>
          <div
            className="p-3 max-w-2xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></div>

            <div className="max-w-4xl mx-auto w-full"><CallToAction /></div>
          
        </main>
      )}
    </div>
  )
}

export default PostPage