import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useGlobalContext } from '../Context'
import axiosRequest from '../utils/axiosRequest'

const Header = () => {
  const path = useLocation().pathname
  const { theme, setTheme } = useGlobalContext()
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

  const handleLogout = async () => {
    try {
      if (currentUser) {
        await axiosRequest.post('/auth/logout')
        sessionStorage.removeItem('currentUser')
      }
      navigate('/login')
    } catch (error) {
      console.log(error.message)
    }
  }

  const changeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', searchTerm)

    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  return (
    <Navbar className="border-b sticky top-0 z-[1000]">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-xl sm:text-2xl font-medium dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 rounded-lg text-slate-100">
          Fabrice's{' '}
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          value={searchTerm}
          placeholder="Search..."
          rightIcon={CiSearch}
          className="hidden lg:inline"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Link to={'/search'}>
        <Button className="w-12 h-10 lg:hidden p-0" color="gray" pill>
          <CiSearch />
        </Button>
      </Link>

      <div className="flex gap-2 md:order-2 items-center">
        {theme === 'light' ? (
          <Button
            className="w-12 h-10 hidden sm:inline p-0"
            color="gray"
            pill
            onClick={changeTheme}
          >
            <FaMoon />
          </Button>
        ) : (
          <Button
            className="w-12 h-10 hidden sm:inline p-0"
            color="gray"
            pill
            onClick={changeTheme}
          >
            <FaSun />
          </Button>
        )}

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser?.photo} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser?.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            {currentUser.isAdmin && (
              <Link to="/dashboard">
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={'/login'}>
            <Button gradientDuoTone={'pinkToOrange'} outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to="/" className={path === '/' ? 'text-lg' : ''}>
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link as={'div'} active={path === '/about'}>
          <Link to={'/about'} className={path === '/about' ? 'text-lg' : ''}>
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link as={'div'} active={path === '/projects'}>
          <Link
            to={'/projects'}
            className={path === '/projects' ? 'text-lg' : ''}
          >
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
