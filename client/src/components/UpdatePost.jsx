import React, { useEffect, useState } from 'react'
import {
  FloatingLabel,
  Select,
  FileInput,
  Button,
  TextInput,
  Alert,
} from 'flowbite-react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase/firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import axiosRequest from '../utils/axiosRequest'
import { HiInformationCircle } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const UpdatePost = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { postId } = useParams()
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

  useEffect(() => {
    try {
      setLoading(true)
      const fetchPost = async () => {
        const res = await axiosRequest.get(`/post/get-posts?postId=${postId}`)

          setFormData(res.data.posts[0])
          setPublishError(null)
          setLoading(false)
      }
      fetchPost()
    } catch (error) {
      setPublishError(error.response.data || 'Something went wrong')
      setLoading(false)
    }
  }, [postId])

  // image upload functionality
  const handleImageUpload = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image')
        return
      }

      setImageUploadError(null)

      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setImageUploadError('Image upload failed')
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null)
            setImageUploadProgress(null)
            setFormData({ ...formData, image: downloadURL })
          })
        }
      )
    } catch (error) {
      setImageUploadError('Image upload failed')
      setImageUploadProgress(null)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

      // if(Object.keys(formData).length === 0) {
      //   console.log('No changes made')
      // }

    try {
      setLoading(true)
      const res = await axiosRequest.put(
        `/post/update-post/${postId}/${currentUser._id}`,
        formData
      )



      setPublishError(null)
      setLoading(false)
      navigate(`/post/${res.data.slug}`)

    } catch (error) {
      setPublishError(error.response.data || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-3 mx-auto max-w-3xl dark:text-gray-200">
      <h1 className="text-center text-4xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {publishError && (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            onDismiss={() => setPublishError(null)}
          >
            <span className="font-medium">Info alert!</span> {publishError.message}
          </Alert>
        )}

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            id="title"
            value={formData.title}
            required
            placeholder="Title"
            className="dark:text-gray-200 flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="health">Health & Fitness</option>
            <option value="social">Social</option>
            <option value="psychology">Psychology</option>
            <option value="media">Media</option>
            <option value="tech">Tech</option>
            <option value="eduction">Education</option>
            <option value="politics">Politics</option>
            <option value="history">History</option>
            <option value="travel">Travel</option>
            <option value="science">Science</option>
            <option value="photography">Photography</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="pinkToOrange"
            outline
            onClick={handleImageUpload}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-14 h-14">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : imageUploadError ? (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                onDismiss={() => setImageUploadError(null)}
              >
                <span className="font-medium">Info alert!</span>{' '}
                {imageUploadError}
              </Alert>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        { formData.image && (
          <img
            src={formData.image}
            alt="post image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          id="content"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          disabled={loading}
          type="submit"
          gradientDuoTone={'purpleToPink'}
        >
          Update
        </Button>
      </form>
    </div>
  )
}

export default UpdatePost
