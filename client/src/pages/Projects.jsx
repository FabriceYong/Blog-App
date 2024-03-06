import React from 'react'
import CallToAction from '../components/CallToAction'

const Projects = () => {
  return (
    <div className='dark:text-gray-200 min-h-screen max-w-3xl mx-auto flex flex-col justify-center items-center gap-6 p-7'>
      <h1 className='md:text-5xl text-3xl font-semibold'>Projects</h1>
      <p>Build fun and engaging projects while learning javascript, HTML and CSS!</p>
      <CallToAction />
    </div>
  )
}

export default Projects