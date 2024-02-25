import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl gap-6 my-8'>
      <div className="flex-1 justify-center flex flex-col gap-3">
        <h2 className='text-3xl'>Want to learn more about JavaScript?</h2>
        <p className='text-gray-500'>Checkout these resources with 100 JavaScript Projects</p>
        <Button gradientDuoTone={'purpleToPink'}>Learn More</Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src={
            'https://cyberhoot.com/wp-content/uploads/2020/07/Free-Courses-to-learn-JavaScript.jpg'
          }
          alt="image"
        />
      </div>
    </div>
  )
}

export default CallToAction