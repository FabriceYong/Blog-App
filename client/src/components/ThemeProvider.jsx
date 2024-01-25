import React, { useState } from 'react'
import { useGlobalContext } from '../Context'

const ThemeProvider = ({children}) => {
    const { theme, setTheme } = useGlobalContext()
  return (
    <div className={theme}>
        <div className="bg-white text-gray-700 dark:gray-200 dark:bg-gray-800 min-h-screen">
            {children}
        </div>
    </div>
  )
}

export default ThemeProvider