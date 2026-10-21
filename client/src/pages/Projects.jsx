import React, { useCallback, useEffect, useState } from "react"
import { FolderPlus, RefreshCw, FolderOpen, Plus, X, LoaderCircle } from "lucide-react"
import api from "../api/axios.js"

import ProjectCard from "../components/ProjectCard.jsx"

export default function Projects() {

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [projectName, setProjectName] = useState("")
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState("")

    const fetchProjects = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const response = await api.get("/projects")
            setProjects(response.data?.projects ?? [])
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Could not load your projects. Please try again"
            )
        } finally {
            setLoading(false)
        }
    }, [])

    const createProject = async (e) => {
        e.preventDefault()
        const name = projectName.trim()
        if (name.length < 2 || name.length > 100) {
            setCreateError("Project name must be between 2 and 100 characters")
            return
        }
        setCreating(true)
        setCreateError("")
        try {
            await api.post("/projects", { name })
            setProjectName("")
            setShowCreateModal(false)
            await fetchProjects()
        } catch (err) {
            setCreateError(
                err.response?.data?.error ||
                "Could not creat project try again."
            )
        } finally {
            setCreating(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    return (
        <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl" >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center" >
                    <div>
                        <p className="text-sm font-medium text-accent" >
                            DEVELOPER CONSOLE
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight" >
                            My Projects
                        </h1>
                        <p className="mt-2 text-sm text-muted" >
                            Manage your projects and authentication settings.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3" >
                        <button
                            type="button"
                            onClick={() => {
                                setCreateError("")
                                setProjectName("")
                                setShowCreateModal(true)
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                            <Plus size={17} />
                            Create Project
                        </button>
                        <button
                            onClick={fetchProjects}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4
                        py-3 text-sm font-medium transition hover:bg-input"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>

                </div>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                    <div className="rounded-2xl border border-border bg-card p-5" >
                        <p className="text-sm text-muted" >Total projects</p>
                        <p className="text-3xl mt-3 font-bold" >
                            {loading ? "-" : projects.length}
                        </p>
                    </div>
                </div>

                <section className="mt-10" >
                    <div className="mb-5 flex items-center gap-2" >
                        <FolderOpen size={20} className="text-accent" />
                        <h2 className="text-lg font-semibold" >
                            All Projects
                        </h2>
                    </div>
                    {loading ? (
                        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted" >
                            Loading your projects...
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-500/30 bg-card p-6" >
                            <p className="text-sm text-danger" >{error}</p>
                            <button
                                onClick={fetchProjects}
                                className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-hover"
                            >
                                Try again
                            </button>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center" >
                            <FolderPlus
                                size={36}
                                className="mx-auto text-muted"
                            />
                            <h3 className="mt-4 text-lg font-semibold" >
                                No Projects yet
                            </h3>
                            <p className="mt-2 text-sm text-muted" >
                                Create your first project to start using EC-Auth
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" >
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onUpdated={fetchProjects}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
            {showCreateModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !creating) {
                            setShowCreateModal(false)
                        }
                    }}
                >
                    <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" >
                        <div className="mb-6 flex items-center justify-between" >
                            <div>
                                <h2 className="text-xl font-bold text-foreground" >
                                    Create a project
                                </h2>
                                <p className="mt-1 text-sm text-muted" >
                                    Set up a project for your application
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                disabled={creating}
                                className="rounded-lg p-2 text-muted transition hover:bg-input hover:text-foreground disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {createError && (
                            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/30 p-3 text-sm text-red-300" >
                                {createError}
                            </div>
                        )}
                        <form onSubmit={createProject} >
                            <label className="mb-2 block text-sm font-medium text-foreground" >
                                Project name
                            </label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="e.g. My Stardance project"
                                minLength={2}
                                maxLength={100}
                                required
                                autoFocus
                                disabled={creating}
                                className="mb-5 w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-accent"
                            />
                            <p className="mb-5 text-xs text-muted" >
                                You can configure allowed frontend origins after creating the project.
                            </p>
                            <div className="flex justify-end gap-3" >
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={creating}
                                    className="rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-input disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || projectName.trim().length < 2}
                                    className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {creating ? (
                                        <>
                                            <LoaderCircle size={16} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={15} />
                                            Create Project
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    )

}