import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

export default function ProctectedRoute(){

    const {user,loading} = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background" >
                <p className="text-muted" >
                    Checking authentication
                </p>
            </div>
        )
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }
    
    return <Outlet/>

}