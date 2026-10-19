import React from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { ShieldCheck, LayoutDashboard, LogOut, FolderKanban } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"

export default function Navbar() {

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    const navClass = ({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
            ? "bg-accent/10 text-accent"
            : "text-muted hover:text-foreground"
        }`

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card" >
            <nav className="relative flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-12" >
                <Link to="/" className="flex items-center gap-3" >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-black" >
                        <ShieldCheck size={23} />
                    </span>
                    <span className="text-xl font-bold tracking-tight" >
                        EC-Auth
                    </span>
                </Link>
                <div className="absolute left-1/2 flex -transalte-x-1/2 items-center gap-4" >
                    <NavLink
                        to="/dashboard"
                        className={navClass}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/projects"
                        className={navClass}
                    >
                        <FolderKanban size={18} />
                        <span>Projects</span>
                    </NavLink>

                    {/* {user && (
                        <div className="hidden text-right sm:block" >
                            <p className="text-sm font-semibold" >
                                {user.name}
                            </p>
                            <p className="text-xs text-muted" >
                                {user.email}
                            </p>
                        </div>
                    )} */}

                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium
                        transition hover:bg-input"
                >
                    <LogOut size={17} />
                    <span className="hidden sm:inline" >Logout</span>
                </button>
            </nav>
        </header>
    )
}