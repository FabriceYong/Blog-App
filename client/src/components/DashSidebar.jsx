import { Sidebar } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { FaSignInAlt, FaUser } from 'react-icons/fa'
import { HiUser } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const DashSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')

    if (tabFromUrl) setTab(tabFromUrl)
  }, [location.search])

  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  const handleSignOut = () => {
    if(currentUser) {
        localStorage.removeItem('currentUser')
    }
    navigate('/login')
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={FaUser}
              label="User"
              labelColor="dark"
              as={'div'}
              className="cursor-pointer"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={FaSignInAlt} className="cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
