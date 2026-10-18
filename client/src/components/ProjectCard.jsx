import React from "react"
import { Folder, Globe, ArrowUpRight } from "lucide-react"

export default function ProjectCard({ project }) {
    return (
        <article className="group rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50" >
            <div className="flex items-start justify-between" >
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-input" >
                    <Folder size={22} className="text-accent" />
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted" >
                    Project
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
                        {project.allowed_origins?.length ?? 0} allowed origins
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        navigator.clipboard.writeText(project.id)
                    }}
                    title="Copy project ID"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/10"
                >
                    Copy ID
                    <ArrowUpRight size={15} />
                </button>
            </div>
        </article>
    )
}