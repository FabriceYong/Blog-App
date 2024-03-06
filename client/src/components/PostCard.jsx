import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  
  return (
    <div className="group relative w-full border h-[370px] overflow-hidden rounded-lg sm:w-[480px] border-teal-500 transition-all">
      <Link to={`/post/${post.slug}`}>
        <img src={post.image} alt={post.title} className='h-[260px] w-full object-cover group-hover:h-[240px] transition-all duration-300 z-20' />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className='text-xl font-semibold line-clamp-1'>{post.title}</p>
        <span className='text-xs italic'>{post.category}</span>
        <Link to={`/post/${post.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'>Read article</Link>
      </div>
    </div>
  )
}

export default PostCard