import {
    createBrowserRouter,
    Navigate
} from "react-router-dom"

import Login from "../pages/Login.jsx"
import Dashboard from "../pages/Dashboard.jsx"
import PublicRoute from "./PublicRoute.jsx"
import ProctectedRoute from "./ProctedRoute.jsx"

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />
            }
        ],
    },
    {
        element: <ProctectedRoute/>,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard/>,
            },
        ],
    },
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }

])