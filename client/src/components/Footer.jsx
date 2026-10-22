import React from "react"
import { ShieldCheck } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card" >
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 lg:px-8" >
                <div className="flex items-center gap-2" >
                    <ShieldCheck size={18} className="text-accent" />
                    <span className="text-sm font-semibold" >
                        EC-Auth
                    </span>
                </div>
                <p className="text-sm text-muted" >
                    &copy; {new Date().getFullYear()} EC-Auth. All rights reserver.
                </p>
                <p className="text-xs text-muted" >
                    Built for Stardance HackClub Event
                </p>
            </div>
        </footer>
    )
}