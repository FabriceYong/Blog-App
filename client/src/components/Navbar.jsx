import React from 'react'
import { Button, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import { FaMoon } from 'react-icons/fa'

const Header = () => {
  const path = useLocation().pathname

  return (
    <Navbar className="border-b z-1000">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-xl sm:text-2xl font-medium dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 rounded-lg text-slate-100">
          Fabrice's{' '}
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={CiSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <CiSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/login">
          <Button gradientDuoTone={'pinkToOrange'} outline>
            Sign In
          </Button>
        </Link>
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
          <Link to={'/projects'} className={path === '/projects' ? 'text-lg' : ''}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
