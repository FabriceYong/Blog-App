import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoute = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  return currentUser ? <Outlet /> : <Navigate to={'/login'} />
}

export default PrivateRoute