import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import RunningDog from "../components/RunningDog.jsx"


export default function MainLayout() {
    const location = useLocation()
    const isHomePage = location.pathname === "/home"
    return (
        <div className="flex min-h-screen flex-col" >
            <Navbar/>
            {!isHomePage && <RunningDog/>}
            <main className="flex-1" >
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}