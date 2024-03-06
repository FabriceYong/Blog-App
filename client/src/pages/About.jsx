import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:text-gray-200">
      <div className="max-w-3xl mx-auto text-center">
        <div className=" ">
          <h1 className="md:text-5xl text-3xl font-semibold text-center my-7">
            About Fabrice's Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6 dark:text-gray-200">
            <p>
              Fabrice's is a blog i created to share my thoughts and ideas with
              the world, I am a software engineer and I love to write about
              technology, coding and everything in between
            </p>
            <p>
              On this blog, you'll find weekly articles and tutorials on topics
              such as web development, software engineering, programming and
              everything else, I am always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About