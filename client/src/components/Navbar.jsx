import React from 'react'
import { Button, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import { FaMoon } from 'react-icons/fa'

const Header = () => {
    const path = useLocation().pathname

  return (
    <Navbar className='border-b'>
        <Link to='/' className='self-center whitespace-nowrap text-xl sm:text-2xl font-medium dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 rounded-lg text-slate-100'>Fabrice's </span>
            Blog
        </Link>
        <form>
            <TextInput type='text' placeholder='Search...' rightIcon={CiSearch} className='hidden lg:inline' />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <CiSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
                <FaMoon />
            </Button>
            <Link to='/sing-in'>
                <Button gradientDuoTone={'pinkToOrange'}>Sign In</Button>
            </Link>
            <Navbar.Toggle />
        </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link as={'div'} active={path === '/about'}>
                    <Link to={'/about'}>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link as={'div'} active={path === '/projects'}>
                    <Link to={'/projects'}>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
    </Navbar>
  )
}

export default Header