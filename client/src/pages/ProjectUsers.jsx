import React, {useCallback,useEffect,useState} from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
    ArrowLeft,
    Users,
    RefreshCw,
    Plus,
    Search,
    Pencil,
    Trash2,
    KeyRound,
    X,
    LoaderCircle
} from "lucide-react"

import api from "../api/axios.js"

const emptyForm = { name: "", email: "", password: "" }

export default function ProjectUsers() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const projectId = searchParams.get("projectId")

    const [users,SetUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")
    const [notice, setNotice] = useState("")
    const [search,setSearch] = useState("")

    const [modal, setModal] = useState("")
    const [selectedUser, setSelectedUser] = useState(null)
    const [form, setForm] = useState(emptyForm)

    const loadUsers = useCallback(async () => {
        if (!projectId) {
            setError("Project ID is missing. Return to projects and select a project")
            setLoading(false)
            return
        }
        setLoading(true)
        setError("")
        try {
            const response = await api.get(
                `/projects/${encodeURIComponent(projectId)}/users`
            )
            SetUsers(response.data.users ?? [])
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Could not load project users. Please try again."
            )
        } finally {
            setLoading(false)
        }
    },[projectId])

    useEffect(() => {
        loadUsers()
    },[loadUsers])

    function openAdd() {
        setSelectedUser(null)
        setForm(emptyForm)
        setError("")
        setNotice("")
        setModal("add")
    }

    function openEdit(user) {
        setSelectedUser(user)
        setForm({
            name: user.name, email: user.email, password: ""
        })
        setError("")
        setNotice("")
        setModal("edit")
    }

    function openPassword(user) {
        setSelectedUser(user)
        setForm(emptyForm)
        setError("")
        setNotice("")
        setModal("password")
    }

    function closeModal() {
        if (busy) return 
        setModal("")
        setSelectedUser(null)
        setForm(emptyForm)
        setError("")
    }

    function updateField(e) {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }))
    }

    async function submitForm(e) {
        e.preventDefault()
        setBusy(true)
        setError("")
        setNotice("")
        const base = `/projects/${encodeURIComponent(projectId)}/users`
        try {
            if (modal === "add") {
                await api.post(base, {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                })
                setNotice("User created successfully")
            } else if (modal === "edit") {
                await api.put(`${base}/${selectedUser.id}`, {
                    name: form.name.trim(),
                    email: form.email.trim(),
                })
                setNotice("User details updated successfully")
            } else if (modal === "password") {
                await api.patch(`${base}/${selectedUser.id}/password`, {
                    password: form.password,
                })
                setNotice("Password updated successfully")
            }
            const completeAction = modal
            setModal("")
            setSelectedUser(null)
            setForm(emptyForm)

            if (completeAction != "password") {
                await loadUsers()
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "The operation failed. Please try again later."
            )
        } finally {
            setBusy(false)
        }
    }

    async function deleteUser(user) {
        const confirmed = window.confirm(
            `Delete ${user.name} (${user.email})? This cannot be undone.`
        )
        if (!confirmed) return
        setBusy(true)
        setError("")
        setNotice("")
        try {
            await api.delete(
                `/projects/${encodeURIComponent(projectId)}/users/${user.id}`
            )
            setNotice(`${user.name} was deleted.`)
            await loadUsers()
        } catch (err) {
            setError(
                err.response?.data?.error || "Could not delete this user."
            )
        } finally {
            setBusy(false)
        }
    }

    const filteredUsers = users.filter((user) => {
        const query = search.trim().toLowerCase()
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            String(user.id).includes(query)
        )
    })

    return (
        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 sm:px-8" >
            <button
                type="button"
                onClick={() => navigate("/projects")}
                className="mb-8 flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
            >
                <ArrowLeft size={18} />
                Back to Projects
            </button>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4" >
                <div>
                    <p className="mb-2 text-sm font-semibold text-accent" >
                        DEVELOPER CONSOLE
                    </p>
                    <h1
                        className="text-3xl font-bold tracking-tight"
                    >
                        Project Users
                    </h1>
                    <p className="mt-2 text-muted" >
                        Manage registered account for this project.
                    </p>
                    <p className="mt-2 break-all text-xs text-muted" > 
                        Project ID: {projectId || "Missing"}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3" >
                    <button
                        type="button"
                        onClick={loadUsers}
                        disabled={loading || busy}
                        className="flex items-center gap-2 rounded-lg broder border-border px-4 py-3 transition hover:bg-input disabled:opacity-50"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={openAdd}
                        disabled={!projectId || busy}
                        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                </div>  
            </div>
            {error && !modal && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300" >
                    {error}
                </div>
            )}
            {notice && !modal && (
                <div className="mb-5 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent" >
                    {notice}
                </div>
            )}
            <section className="mb-6 rounded-2xl border border-border bg-card p-5" >
                <div className="flex items-center gap-3" >
                    <div className="rounded-xl bg-accent/10 p-3 text-accent" >
                        <Users size={23} />
                    </div>
                    <div>
                        <p className="text-sm text-muted" >Total users</p>
                        <p className="text-2xl font-bold" >{users.length}</p>
                    </div>
                </div>
            </section>
            <section className="overflow-hidden rounded-2xl border border-border bg-card" >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5" >
                    <div>
                        <h2 className="text-lg font-semibold" >All Users</h2>
                        <p className="mt-1 text-sm text-muted" >
                            {filteredUsers.length} user(s) displaying
                        </p>
                    </div>
                    <label className="flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 sm:w-80" >
                        <Search size={17} className="shrink-0 text-muted" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email or ID"
                            className="min-w-0 w-full bg-transparent py-3 text-sm outline-none"
                        />
                    </label>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center gap-3 p-12 text-muted" >
                        <LoaderCircle className="animate-spin" size={20} />
                        Loading users...
                    </div>
                ) : error && users.length === 0 ? (
                    <div className="p-8 text-center" >
                        <p className="text-red-400" >{error}</p>
                        <button
                            type="button"
                            onClick={loadUsers}
                            className="mt-4 text-accent hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center" >
                        <Users size={32} className="mx-auto mb-3 text-muted" />
                        <h3 className="font-semibold" >
                            {search ? "No matching users" : "No users yet"}
                        </h3>
                        <p className="mt-2 text-sm text-muted" >
                            {
                                search
                                    ? "Try another search."
                                    : "Add a user or wait for someone to register through your application"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto" >
                        <table className="w-full text-left text-sm" >
                            <thead className="border-b border-border text-muted" >
                                <tr>
                                    <th className="whitespace-nowrap p-4" >User</th>
                                    <th className="p-4" >Email</th>
                                    <th className="whitespace-nowrap p-4" >Created</th>
                                    <th className="p-4" >Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-border last:border-0 hover:bg-input/30"
                                    >
                                        <td className="p-4" >
                                            <div className="flex items-center gap-3" >
                                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 font-bold text-accent" >
                                                    {user.name.charAt(0).toLowerCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold" >{user.name}</p>
                                                    <p className="mt-1 text-xs text-muted" >
                                                        ID: {user.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4" >{user.email}</td>
                                        <td className="whitespace-nowrap p-4 text-muted" >
                                            {user.created_at
                                                ? new Date(user.created_at).toLocaleDateString()
                                                : "-"
                                            }
                                        </td>
                                        <td className="p-4" >
                                            <div className="flex flex-wrap gap-2" >
                                                <button
                                                    type="button"
                                                    title="Edit name and email"
                                                    onClick={() => openEdit(user)}
                                                    disabled={busy}
                                                    className="rounded-lg border border-border p-2 transition hover:bg-input disabled:opacity-50"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Update password"
                                                    onClick={() => openPassword(user)}
                                                    className="rounded-lg border border-border p-2 text-accent transition hover:bg-input disabled:opacity-50"
                                                >
                                                    <KeyRound size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Delete user"
                                                    onClick={() => deleteUser(user)}
                                                    disabled={busy}
                                                    className="rounded-lg border border-red-500/30 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            {modal && (
                <Modal
                    title={
                        modal === "add"
                            ? "Add User"
                            : modal === "edit"
                                ? "Edit User Details"
                                : "Update Password"
                    }
                    onClose={closeModal}
                >
                    {error && (
                        <div className="mb-4 rounded-lg border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300" >
                            {error}
                        </div>
                    )}
                    <form onSubmit={submitForm}>
                        {modal === "add" && (
                            <>
                                <Field
                                    label="Full name"
                                    name="name"
                                    value={form.name}
                                    onChange={updateField}
                                    minLength={3}
                                    maxLength={100}
                                    required
                                    autoComplete="name"
                                    placeholder="Enter full name"
                                />
                                <Field
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={updateField}
                                    maxLength={255}
                                    required
                                    autoComplete="email"
                                    placeholder="user@stardance.com"
                                />
                                <Field
                                    label="Initial password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={updateField}
                                    minLength={8}
                                    maxLength={72}
                                    required
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                />
                                <p className="mb-4 text-xs text-muted" >
                                    The password will be securely hashed. It cannot be viewed be viewed later.
                                </p>
                            </>
                        )}
                        {modal === "edit" && (
                            <>
                                <Field
                                    label="Full name"
                                    name="name"
                                    value={form.name}
                                    onChange={updateField}
                                    minLength={3}
                                    maxLength={100}
                                    required
                                    autoComplete="name"
                                />
                                <Field
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={updateField}
                                    maxLength={255}
                                    required
                                    autoComplete="email"
                                />
                                <p className="mb-4 text-xs text-muted" >
                                    To change the password, use the seperate Update Password action.
                                </p>
                            </>
                        )}
                        {modal === "password" && (
                            <>
                                <p className="mb-4 text-sm text-muted" >
                                    Change the password for{" "}
                                    <span className="font-semibolrd text-foreground" >
                                        {selectedUser?.email}
                                    </span>.
                                    The current password is never displayed.
                                </p>
                                <Field
                                    label="New password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={updateField}
                                    minLength={8}
                                    maxLength={72}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Enter a new password"
                                />
                            </>
                        )}
                        <div className="mt-6 flex justify-end gap-3" >
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={busy}
                                className="rounded-lg border border-border px-4 py-2.5 hover:bg-input disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-black hover:opacity-90 disabled:opacity-50"
                            > 
                                {busy && <LoaderCircle size={16} className="animate-spin" />}
                                {
                                    busy
                                        ? "Saving..."
                                        : modal === "add"
                                            ? "Create User"
                                            : modal === "edit"
                                                ? "Save Changes"
                                                : "Update Password"
                                }
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </main>
    )
}

function Modal({ title, onClose, children }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6" >
                <div className="mb-6 flex items-center justify-between gap-4" >
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-input"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </section>
        </div>
    )
}

function Field({ label, ...props }) {
    return (
        <label className="mb-4 block" >
            <span className="mb-2 block text-sm font-medium" >{label}</span>
            <input
                {...props}
                className="w-full rounded-lg border border-broder bg-input px-3 py-3 text-foreground outline-none focus:border-accent"
            />
        </label>
    )
}