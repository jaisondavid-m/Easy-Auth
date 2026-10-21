import React, { useState } from "react"
import { Folder, Globe, ArrowUpRight, Copy, Check, Plus, Pencil, Trash2, X, Save, LoaderCircle, ProjectorIcon } from "lucide-react"
import api from "../api/axios.js"
import EditingModal from "./EditingModal.jsx"
import { useNavigate } from "react-router-dom"

export default function ProjectCard({ project, onUpdated }) {
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false)
    const [origins, setOrigins] = useState(
        project.allowed_origins ?? []
    )
    const [newOrigin, setNewOrigin] = useState("")
    const [editIndex, setEditIndex] = useState(null)
    const [editValue, setEditValue] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState(false)
    const openEditor = () => {
        setOrigins(project.allowed_origins ?? [])
        setNewOrigin("")
        setEditIndex(null)
        setError("")
        setEditValue("")
        setEditing(true)
    }
    const addOrigin = () => {
        const value = newOrigin.trim()
        if (!value) return
        if (origins.length >= 5) {
            setError("You can add up to 5 frontend URLS")
            return
        }
        if (origins.includes(value)) {
            setError("This URL has already been added.")
            return
        }
        setOrigins((current) => [...current, value])
        setNewOrigin("")
        setError("")
    }
    const startEditing = (index) => {
        setEditIndex(index)
        setEditValue(origins[index])
        setError("")
    }
    const saveEdit = () => {
        const value = editValue.trim()
        if (!value) {
            setError("Frontend URL cannot be empty")
            return
        }
        if (origins.some((origin, index) =>
            index !== editIndex && origin === value
        )) {
            setError("This URL has already been added.")
            return
        }

        setOrigins((current) =>
            current.map((origin, index) =>
                index === editIndex ? value : origin
            )
        )

        setEditIndex(null)
        setEditValue("")
        setError("")

    }

    const deleteOrigin = (index) => {
        setOrigins((current) =>
            current.filter((_, currentIndex) => currentIndex !== index)
        )
        if (editIndex === index) {
            setEditIndex(null)
            setEditValue("")
        } else if (editIndex !== null && editIndex > index) {
            setEditIndex((current) => current - 1)
        }
        setError("")
    }

    const saveOrigins = async () => {
        if (editIndex !== null) {
            setError("Save or cancel your current URL edit first")
            return
        }
        const normalized = []
        for (const value of origins) {
            try {
                const url = new URL(value)
                if (
                    !["http:", "https:"].includes(url.protocol) ||
                    url.username ||
                    url.password ||
                    !["", "/"].includes(url.pathname) ||
                    url.search ||
                    url.hash
                ) {
                    throw new Error()
                }
                const origin = url.origin
                if (!normalized.includes(origin)) {
                    normalized.push(origin)
                }
            } catch {
                setError(`Invalid origin: ${value}`)
                return
            }
        }
        if (normalized.length > 5) {
            setError("You can add up to 5 frontend urls")
            return
        }

        setSaving(true)
        setError("")

        try {
            await api.put(`/projects/${project.id}/origins`, {
                origins: normalized,
            })
            setOrigins(normalized)
            setEditing(false)
            if (onUpdated) await onUpdated()
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Could not save frontend URLs."
            )
        } finally {
            setSaving(false)
        }
    }

    const copyID = async () => {
        try {
            await navigator.clipboard.writeText(project.id)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setError("Could not copy project ID.")
        }
    }

    const openProjectUsers = () => {
        navigate(`/project/users?projectId=${encodeURIComponent(project.id)}`)
    }

    return (
        <div
            onClick={openProjectUsers}
            role="link"
            tabIndex={0}
            className="cursor-pointer"
            onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return 
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openProjectUsers()
                } 
            }}
        >
            <article className="rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50" >
                <div className="flex items-start justify-between" >
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-input" >
                        <Folder size={22} className="text-accent" />
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs ${
                            project.allowed_origins?.length
                                ? "bg-accent/10 text-accent"
                                : "bg-amber-400/10 text-amber-300"     
                        }`}
                    >
                        {project.allowed_origins?.length
                            ? "Configured"
                            : "Setup required"
                        }
                    </span>
                </div>
                <h2 className="mt-5 truncate text-lg font-semibold text-foreground" >
                    {project.name}
                </h2>
                <p className="mt-2 break-all text-xs text-muted" >
                    ID: {project.id}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4" >
                    <div className="flex items-center gap-2 text-sm text-muted" >
                        <Globe size={16} />
                        <span>
                            {project.allowed_origins?.length ?? 0}/5 origins
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            copyID()
                        }}
                        title="Copy project ID"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/10"
                    >
                       {copied ? <Check size={16} /> : <Copy size={16} />}
                       {copied ? "Copied" : "Copy ID"}
                        {/* <ArrowUpRight size={15} /> */}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        openEditor()
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:border-accent/50 hover:bg-input"
                >
                    <Globe size={17} />
                    Manage CORS origins
                    <Pencil size={15} />
                </button>
            </article>
            {editing && (
                <EditingModal
                    project={project}
                    setEditing={setEditing}
                    setError={setError}
                    origins={origins}
                    error={error}
                    editIndex={editIndex}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    saveEdit={saveEdit}
                    setEditIndex={setEditIndex}
                    deleteOrigin={deleteOrigin}
                    addOrigin={addOrigin}
                    newOrigin={newOrigin}
                    setNewOrigin={setNewOrigin}
                    saving={saving}
                    saveOrigins={saveOrigins}
                    startEditing={startEditing}
                />
            )}
        </div>
    )
}