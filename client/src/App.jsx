import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
// Pages
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import CreatePost from './pages/CreatePost'

// components
import Navbar from './components/Navbar'
import FooterCom from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import UpdatePost from './components/UpdatePost'
import PostPage from './pages/PostPage'


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
        element: <Home />,
      },
      {
        path: '/login',
        element: <SignIn />,
      },
      {
        path: '/register',
        element: <SignUp />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/about',
            element: <About />,
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
        ],
      },
      {
        element: <AdminPrivateRoute />,
        children: [
          {
            path: '/create-post',
            element: <CreatePost />,
          },
          {
            path: 'update-post/:postId',
            element: <UpdatePost />,
          },
        ],
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/post/:postSlug',
        element: <PostPage />
      },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
