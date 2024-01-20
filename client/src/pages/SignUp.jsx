import React, { useState } from 'react'
import { Button, TextInput, Label, FloatingLabel } from 'flowbite-react'
import { FaGoogle, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import axiosRequest from '../utils/axiosRequest'

const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const { username, password, email } = formData

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      if(!email || !password || !username) {
        setError('Please fill out all fields')
        setLoading(false)
        return
      }

      const res = await axiosRequest.post('/auth/register', { email, password, username })

      localStorage.setItem('currentUser', JSON.stringify(res.data))

      setError(null)
      setLoading(false)
      navigate('/login')
    } catch (err) {
      setError(err.response.data)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
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
            This is a demo project, you can sign up with your email and password
            or with Google
          </p>
        </div>
        <div className="flex-1">
          {error && <p className='mb-3 bg-red-500 text-sm text-center text-slate-100'>{error.message}</p>}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="w-full">
              <FloatingLabel
                type="text"
                variant="outlined"
                label="Your username"
                value={username}
                sizing="md"
                id="username"
                onChange={handleChange}
              />
              {/* <TextInput type="text" id='username' placeholder="John Doe" /> */}
            </div>

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
              <FaSignInAlt className='mr-2 text-lg' /> Sign Up
            </Button>
            <Button gradientDuoTone={'purpleToPink'} outline type="button">
              <FaGoogle className="flex items-start mr-2" />
              <span>Sign Up with Google Account</span>
            </Button>
          </form>
          <p className="py-4 font-semibold text-slate-600">
            Already have an account ?{' '}
            <Link to={'/login'} className="underline text-purple-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
