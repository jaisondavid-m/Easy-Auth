import React, {useCallback, useEffect, useState} from "react"
import { FolderPlus, RefreshCw, FolderOpen } from "lucide-react"
import api from "../api/axios.js"

import ProjectCard from "../components/ProjectCard.jsx"

export default function Projects() {

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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
    },[])

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
                    <button
                        onClick={fetchProjects}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4
                        py-3 text-sm font-medium transition hover:bg-input"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""}/>
                        Refresh
                    </button>
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
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )

}