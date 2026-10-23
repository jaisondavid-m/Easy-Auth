import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"

export default function Register() {

    const { register } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (event) => {
        setForm((previous) => (
            {
                ...previous,
                [event.target.name]: event.target.value,
            }
        ))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            })
            navigate("/dashboard", {replace: true})
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to create your account. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10" >
            <section className="w-full max-w-md" >
                <Link to="/login" className="mb-8 flex items-center gap-3 justify-center" >
                    <span
                        className="text-xl font-bold tracking-tight"
                    >
                        EC-Auth
                    </span>
                </Link>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8" >
                    <h1 className="text-3xl font-bold tracking-tight" >
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-muted" >
                        Get started with your EC-Auth account.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div >
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium"
                            >
                                Full Name
                            </label>
                            <input type="text" id="name" name="name"
                            autoComplete="name" required minLength={2} maxLength={100}
                            placeholder="Enter your full name" value={form.name}
                            onChange={handleChange} className="auth-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium">
                                Email address
                            </label>
                            <input type="email" id="email" name="email" autoComplete="email" required
                            maxLength={255} placeholder="jaisondavidm@gmail.com"
                            value={form.email} onChange={handleChange} className="auth-input" />
                        </div>
                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium">
                                Password
                            </label>
                            <input type="password" id="password" name="password" 
                            autoComplete="new-password" required minLength={8} 
                            maxLength={72} placeholder="Create a password"
                            value={form.password} onChange={handleChange} className="auth-input"/>
                            <p className="mt-2 text-xs text-muted" >
                                Use at least 8 characters
                            </p>
                        </div>
                        {error && (
                            <p role="alert"
                            className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-danger" >
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="auth-button"
                        >
                            {submitting ? "Creating account..." : "Create account"}
                            {!submitting && <ArrowRight size={16} />}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-muted" >
                        ALready have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-accent hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )

}