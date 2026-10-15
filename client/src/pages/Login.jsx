import React, { useState } from "react"
import {
    Link, useLocation, useNavigate
} from "react-router-dom"
import {
    ArrowRight, ShieldCheck
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Login() {

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const [error, setError] = useState("")
    const [submitting, setSUbmitting] = useState(false)

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async (event) => {

        event.preventDefault()
        setError("")
        setSUbmitting(true)

        try {
            await login(form)
            const destination = location.state?.from?.pathname;
            navigate(destination || "/dashboard", {replace: true})
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to sign in. Please try again"
            )
        } finally {
            setSUbmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center
        bg-background px-4 py-10" >
            <section className="w-full max-w-md" >
                <Link to="/" className="mb-8 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-black" >
                        <ShieldCheck size={24} />
                    </span>
                    <span className="text-xl font-bold tracking-tight" >
                        EC-Auth
                    </span>
                </Link>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8" >
                    <h1 className="text-3xl font-bold tracking-tight" >
                        Welecome back
                    </h1>
                    <p className="mt-2 text-sm text-muted" >
                        Enter your Details to sign to your account
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 text-sm font-medium">
                                Email address
                            </label>
                            <input type="email" id="email" name="email" autoComplete="email" required 
                                maxLength={255} placeholder="jaisondavidm@gmail.com" value={form.email}
                                onChange={handleChange} className="auth-input" />
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium">
                                Password
                            </label>
                            <input type="password" id="password" name="password" autoComplete="current-password" 
                            required minLength={3} maxLength={72} placeholder="Enter your password"
                            value={form.password} onChange={handleChange} className="auth-input" />
                        </div>
                        {error && (
                            <p role="alert" className="rounded-xl border-red-500/30 bg-red-500/10 p-3 text-sm text-danger">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="auth-button"
                        >
                            {submitting ? "Signing in..." : "Sign in"}
                            {!submitting && <ArrowRight size={14} />}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-muted" >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-accent hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )

}