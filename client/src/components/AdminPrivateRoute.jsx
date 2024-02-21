import React from 'react'
import CreatePost from '../pages/CreatePost'
import { Navigate, Outlet } from 'react-router-dom'

const AdminPrivateRoute = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  return currentUser?.isAdmin ? <Outlet /> : <Navigate to='/login' />
}

export default AdminPrivateRoute