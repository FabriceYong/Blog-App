import React, { useEffect, useRef, useState } from 'react'
import { Button, FloatingLabel, TextInput, Alert, Modal } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { app } from '../firebase/firebase'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { HiInformationCircle } from 'react-icons/hi'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import axiosRequest from '../utils/axiosRequest'

const DashProfile = () => {
  const navigate = useNavigate()
  const fileRef = useRef()
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({})

  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const res = await axiosRequest.post('/auth/logout')

      localStorage.removeItem('currentUser')

      navigate('/login')
      setError(null)
      setLoading(false)
    } catch (error) {
      setError(error.response.data)
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async () => {
    // upload image firebase rules
    // rules_version = '2'

    // Craft rules based on data in your Firestore database
    // allow write: if firestore.get(
    //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read,
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/*');
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile?.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadProgress(progress.toFixed(0))
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        )
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl)
          setFormData({ ...formData, photo: downloadUrl })
          setImageFileUploading(false)
        })
      }
    )
  }

  useEffect(() => {
    if(imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made')
      setLoading(false)
    }

    if(imageFileUploading) {
      setUpdateUserError('Image still uploading, Please wait!')
      return
    }

    try {
      setUpdateUserError(null)
      setUpdateUserSuccess(null)
      setLoading(true)
      const res = await axiosRequest.put(
        `/user/update/${currentUser._id}`,
        formData
      )

      let user = localStorage.getItem('currentUser')
      if (user) {
        user = localStorage.setItem(JSON.stringify('currentUser', res.data))
      }
      // JSON.stringify(localStorage.setItem('currentUser', res.data))

      setUpdateUserSuccess('User info updated successfully')
      setError(null)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setShowModal(false)
      setLoading(true)
      setError(null)
      const res = await axiosRequest.delete(`/user/delete/${currentUser._id}`)
      localStorage.removeItem('currentUser')
      if (!res.ok) {
        setError(res.data.message)
        setLoading(false)
      }
    } catch (error) {
      setError(error.response.data)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-medium text-3xl dark:text-gray-200">
        Profile
      </h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/.*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mb-6">
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.photo}
            alt="profile picture"
            className={`rounded-full w-full h-full object-cover border-8 border-[light-gray] ${
              imageFileUploadProgress < 100 && 'opacity-60'
            }`}
            onClick={() => fileRef.current.click()}
          />
        </div>
        {imageFileUploadError ? (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setImageFileUploadError(null)}
          >
            <span className="font-medium">Info alert!</span>{' '}
            {imageFileUploadError}
          </Alert>
        ) : error ? (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setError(null)}
          >
            <span className="font-medium">Info alert!</span> {error.message}
          </Alert>
        ) : updateUserSuccess ? (
          <Alert
            color="success"
            icon={HiInformationCircle}
            onDismiss={() => setUpdateUserSuccess(null)}
          >
            <span className="font-medium">Info alert!</span> {updateUserSuccess}
          </Alert>
        ) : updateUserError ? (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setUpdateUserError(null)}
          >
            <span className="font-medium">Info alert!</span> {updateUserError}
          </Alert>
        ) : null}
        <FloatingLabel
          type="text"
          id="username"
          variant="outlined"
          label="Username"
          sizing="md"
          defaultValue={currentUser?.username}
          className="dark:text-gray-200"
          onChange={handleChange}
        />
        <FloatingLabel
          type="email"
          id="email"
          variant="outlined"
          label="Email"
          sizing="md"
          defaultValue={currentUser?.email}
          className="dark:text-gray-200"
          onChange={handleChange}
        />
        <FloatingLabel
          type="password"
          id="password"
          variant="outlined"
          label="Password"
          sizing="md"
          className="dark:text-gray-200"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone={'pinkToOrange'}
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser?.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone={'purpleToBlue'}
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 mt-6 flex justify-between">
        <span
          type="button"
          className="cursor-pointer font-medium"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span
          type="button"
          className="cursor-pointer font-medium"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'md'}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiInformationCircle className="text-5xl mx-auto text-red-700" />
            <p className="my-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </p>
            <div className="flex items-center justify-center gap-5">
              <Button color="failure" outline onClick={handleDeleteAccount}>
                Yes, I'm sure
              </Button>
              <Button color="gray" outline onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile
