import React from "react"
import { useAuth } from "../context/AuthContext.jsx"


function Dashboard() {

    const {user,logout} = useAuth()

    return (
        <main className="min-h-screen bg-zinc-950 p-8 text-white" >
            <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8" >
                <h1 className="text-3xl font-bold" >
                    Welcome to EC-Auth
                </h1>
                <p className="mt-4 text-zinc-400" >
                    You are successfully logged in.
                </p>    
                <p className="mt-4" >
                    Name: {user?.name}
                </p>
                <p>
                    Email: {user?.email}
                </p>
                <button
                    onClick={() => {
                        logout()
                        window.location.replace("/login")
                    }}
                    className="mt-6 rounded-lg bg-lime-400 px-5 py-3 font-semibold text-black hover:bg-lime-300"
                >
                    Logout
                </button>
            </div>
        </main>
    )

}

export default Dashboard