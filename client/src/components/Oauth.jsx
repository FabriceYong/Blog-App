import React, { useState } from 'react'
import { Button } from 'flowbite-react'
import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase/firebase'
import axiosRequest from '../utils/axiosRequest'
import { useNavigate } from 'react-router-dom'

const Oauth = () => {
  const auth = getAuth(app)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      setLoading(true)
      const resultsFromGoogle = await signInWithPopup(auth, provider)

      const res = await axiosRequest.post('/auth/google', {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        photo: resultsFromGoogle.user.photoURL,
      })

      localStorage.setItem('currentUser', JSON.stringify(res.data))
      
      setError(null)
      setLoading(false)
      navigate('/')
    } catch (error) {
      setError(error.response.data)
      setLoading(false)
    }
  }

  return (
    <Button
      gradientDuoTone={'purpleToPink'}
      outline
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <FcGoogle className="text-xl mr-2" />
      <span>Continue with Google</span>
    </Button>
  )
}

export default Oauth
