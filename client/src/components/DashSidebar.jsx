import { Sidebar } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { FaComment, FaSignInAlt, FaUser } from 'react-icons/fa'
import { HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axiosRequest from '../utils/axiosRequest'

const DashSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')

    if (tabFromUrl) setTab(tabFromUrl)
  }, [location.search])

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

  const handleSignOut = async () => {
    try {
      if (currentUser) {
        const res = await axiosRequest.post('/auth/logout')
        sessionStorage.removeItem('currentUser')
      }
      navigate('/login')
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={FaUser}
              label={currentUser.isAdmin ? 'Admin' : "User"}
              labelColor="dark"
              as={'div'}
              className={tab === 'profile' ? 'font-bold text-gray-600' : 'font-medium text-gray-700'}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to={'/dashboard?tab=posts'}>
            <Sidebar.Item icon={HiDocumentText} active={tab === 'posts'} as='div' className={tab === 'posts' ? 'font-bold text-gray-700' : 'font-medium text-gray-600'}>
              Posts
            </Sidebar.Item>
          </Link>
          )}

          {currentUser.isAdmin && (
            <Link to={'/dashboard?tab=users'}>
              <Sidebar.Item icon={HiOutlineUserGroup} active={tab === 'users'} as='div' className={tab === 'users' ? 'font-bold text-gray-700' : 'font-medium text-gray-600'}>
                Users
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to={'/dashboard?tab=comments'}>
              <Sidebar.Item icon={FaComment} active={tab === 'comments'} as='div' className={tab === 'comments' ? 'font-bold text-gray-700' : 'font-medium text-gray-600'}>
                Comments
              </Sidebar.Item>
            </Link>
          )}
          
          <Sidebar.Item
            icon={FaSignInAlt}
            className="cursor-pointer font-medium text-red-500 dark:text-red-500"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
