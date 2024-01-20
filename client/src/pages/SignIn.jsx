import React, { useState } from 'react'
import { Button, TextInput, Label, FloatingLabel } from 'flowbite-react'
import { FaGoogle, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { password, email } = formData

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col md:flex-row md:items-center p-3 max-w-5xl mx-auto gap-8">
        <div className="mb-4 flex-1">
          <Link className="font-bold text-4xl">
            <span className="py-1 px-2 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 rounded-lg text-slate-100 ">
              Fabrice's{' '}
            </span>
            Blog
          </Link>
          <p className="text-slate-700 font-semibold text-sm mt-4">
            This is a demo project, you can sign in with your email and password
            or with Google
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div>
              <FloatingLabel
                type="email"
                variant="outlined"
                label="email@example.com"
                value={email}
                sizing="md"
                id="email"
                onChange={handleChange}
              />
              {/* <TextInput type="email" id='email' placeholder="email@example.com" /> */}
            </div>

            {showPassword ? (
              <div className="relative">
                <FloatingLabel
                  type="text"
                  variant="outlined"
                  label="Password"
                  value={password}
                  sizing="md"
                  id="password"
                  onChange={handleChange}
                />
                {/* <TextInput type="text" id='password' /> */}
                <FaEyeSlash
                  className="absolute top-4 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            ) : (
              <div className="relative">
                <FloatingLabel
                  type="password"
                  variant="outlined"
                  label="Password"
                  value={password}
                  sizing="md"
                  id="password"
                  onChange={handleChange}
                />
                {/* <TextInput type="text" id='password' /> */}
                <FaEye
                  className="absolute top-4 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            )}

            <Button gradientDuoTone={'pinkToOrange'} type="submit">
              <FaSignInAlt className='mr-2 text-lg' />Sign In
            </Button>
            <Button gradientDuoTone={'purpleToPink'} outline type="button">
              <FaGoogle className="flex items-start mr-2" />
              <span>Sign In with Google Account</span>
            </Button>
          </form>
          <p className="py-4 font-semibold text-slate-600">
            Not yet registered ?{' '}
            <Link to={'/register'} className="underline text-purple-600">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
