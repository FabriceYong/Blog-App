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
import FooterCom from './components/Footer'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <FooterCom />
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
        path: '/login',
        element: <SignIn />
      },
      {
        path: '/register',
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
