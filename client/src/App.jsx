import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
// Pages
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'

// components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    {
      path: '/projects',
      element: <Projects />,
    },
    ]
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
