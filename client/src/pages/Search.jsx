import { Button, FloatingLabel, Select, Spinner, Alert } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosRequest from '../utils/axiosRequest'
import { HiInformationCircle } from 'react-icons/hi'
import PostCard from '../components/PostCard'

const Search = () => {
  const [sidebarData, setSideBarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const sortFromUrl = urlParams.get('sort')
    const categoryFromUrl = urlParams.get('category')

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      })
    }

    const fetchPost = async () => {
      try {
        setLoading(true)
        const searchQuery = urlParams.toString()
        const res = await axiosRequest.get(`/post/get-posts?${searchQuery}`)

        if (res.data.posts.length > 9) {
          setShowMore(true)
        } else {
          setShowMore(false)
        }
        
        setShowMore(false)
        setPosts(res.data.posts)
        setLoading(false)
        setError(null)

      } catch (error) {
        setError(error.response.data || 'Something went wrong')
        setLoading(false)
      }
    }

    fetchPost()
  }, [location.search])

//   console.log(posts)

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSideBarData({ ...sidebarData, searchTerm: e.target.value })
    }

    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'
      setSideBarData({ ...sidebarData, sort: order })
    }

    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized'
      setSideBarData({ ...sidebarData, category })
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('category', sidebarData.category)

    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const handleShowMore = async () => {
    const numberOfPosts = posts.length
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()

    const res = axiosRequest.get(`/post/get-posts?${searchQuery}`)

    if(res.data.posts.length <= 9) {
        setShowMore(false)
    }

    if(res.data.posts.length > 9) {
        setShowMore(true)
    }
  }

  console.log(posts)

  return (
    <div className="min-h-screen dark:text-gray-200 flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-300 dark:border-gray-600">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* search using a search term */}
          <div className="">
            <FloatingLabel
              type="text"
              variant="outlined"
              label="searchTerm"
              value={sidebarData.searchTerm}
              sizing="md"
              className="dark:text-gray-200"
              id="searchTerm"
              onChange={handleChange}
            />
          </div>

          {/* sort from oldest to newest or vice versa */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold">
              Sort:{' '}
            </label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="asc">Latest</option>
              <option value="desc">Oldest</option>
            </Select>
          </div>

          {/* search by category */}
          <div className="flex items-center gap-2">
            <label htmlFor="category" className="font-semibold">
              Category:{' '}
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
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
          <Button type="submit" outline gradientDuoTone={'purpleToPink'}>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-300 p-3 mt-5 dark:border-gray-600">
          Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading ? (
            <div className="mx-auto my-8">
              <Spinner
                color="purple"
                aria-label="Extra large spinner example Purple"
                size="xl"
              />
              <span className="font-medium text-lg text-purple-600 dark:text-purple-300 ml-4">
                Loading...
              </span>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center mx-auto py-6 text-lg">
              <Alert color="failure" className="max-w-3xl mx-auto">
                <span className="font-bold mr-2">Info alert!</span>
                <span>
                  Sorry! no posts found matching your search parameters
                </span>
              </Alert>
            </p>
          ) : (
            <div className="flex flex-wrap gap-6 justify-center">
              {posts?.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
          {showMore && (
            <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7'>Show more</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
