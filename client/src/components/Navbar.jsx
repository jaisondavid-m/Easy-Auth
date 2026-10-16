import React from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { ShieldCheck, LayoutDashboard, LogOut } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"

export default function Navbar() {

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login", {replace: true})
    }

    return (
        <header className="sticky top-0 x-50 border-b border-border bg-card/95 backdrop-blur" >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" >
                <Link to="/" className="flex items-center gap-3" >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-black" >
                        <ShieldCheck size={23}/>
                    </span>
                    <span className="text-xl font-bold tracking-tight" >
                        EC-Auth
                    </span>
                </Link>
                <div className="flex items-center gap-4" >
                    <NavLink
                        to="/dashboard"
                        className={({isActive}) => 
                            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                isActive
                                    ? "bg-accent/10 text-accent"
                                    : "text-muted hover:text-foreground"
                            }`
                        }
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                    {user && (
                        <div className="hidden text-right sm:block" >
                            <p className="text-sm font-semibold" >
                                {user.name}
                            </p>
                            <p className="text-xs text-muted" >
                                {user.email}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium
                        transition hover:bg-input"
                    >
                        <LogOut size={17}/>
                        <span className="hidden sm:inline" >Logout</span>
                    </button>
                </div>
            </nav>
        </header>
    )
}