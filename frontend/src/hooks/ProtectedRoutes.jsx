import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Login } from "../components/User Components/Login"

const useAuth = () =>{

    const [isAuthenticated, setisAuthenticated] = useState(false)

    useEffect(() => {
      
        if(localStorage.getItem("token") != null)
        {
            setisAuthenticated(true)
        }

    }, [])

    return isAuthenticated
}

export const ProtectedRoutes = () => {

    const auth = useAuth()

    return auth == true?<Outlet/> : <Login/>

}