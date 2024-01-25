import React, { useEffect, useRef, useState } from 'react'
import { Button, FloatingLabel, TextInput, Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { app } from '../firebase/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { HiInformationCircle } from 'react-icons/hi'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const DashProfile = () => {
  const navigate = useNavigate()
  const fileRef = useRef()
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  const handleSignOut = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
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
            setImageFileUploadError('Could not upload image (File must be less than 2MB)')
            setImageFileUploadProgress(null)
            setImageFile(null)
            setImageFileUrl(null)
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                setImageFileUrl(downloadUrl)
            })
        }
    )
  }

//   console.log(imageFileUploadProgress, imageFileUploadError)

  useEffect(() => {
    uploadImage()
  }, [imageFile])

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-medium text-3xl dark:text-gray-200">
        Profile
      </h1>
      <form className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/.*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mb-6">
            {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}, path: {
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                }}} />
            )}
          <img
            src={imageFileUrl || currentUser?.photo}
            alt="profi{le picture"
            className={`rounded-full w-full h-full object-cover border-8 border-[light-gray] ${imageFileUploadProgress < 100 && 'opacity-60'}`}
            onClick={() => fileRef.current.click()}
          />
        </div>
        {imageFileUploadError && (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setImageFileUploadError(null)}
          >
            <span className="font-medium">Info alert!</span> {imageFileUploadError}
          </Alert>
        )}
        <FloatingLabel
          type="text"
          id="username"
          variant="outlined"
          label="Username"
          sizing="md"
          defaultValue={currentUser?.username}
          className="dark:text-gray-200"
        />
        <FloatingLabel
          type="email"
          id="email"
          variant="outlined"
          label="Email"
          sizing="md"
          defaultValue={currentUser?.email}
          className="dark:text-gray-200"
        />
        <FloatingLabel
          type="password"
          id="password"
          variant="outlined"
          label="Password"
          sizing="md"
          defaultValue={currentUser?.password}
          className="dark:text-gray-200"
        />
        <Button type="submit" gradientDuoTone={'pinkToOrange'} outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-6 flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  )
}

export default DashProfile
