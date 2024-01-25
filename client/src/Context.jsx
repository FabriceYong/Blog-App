import React, { createContext, useContext, useState } from "react";

export const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

const AppContext = ({children}) => {
    const [theme, setTheme] = useState('light')

    return (
        <GlobalContext.Provider value={{ theme, setTheme }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default AppContext