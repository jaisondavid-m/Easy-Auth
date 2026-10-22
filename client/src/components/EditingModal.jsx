import { Check, Globe, LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import React from "react"

export default function EditingModal({ project, setEditing, setError, origins, error, editIndex, editValue, setEditValue, saveEdit, setEditIndex, startEditing, deleteOrigin, addOrigin, newOrigin, setNewOrigin, saving, saveOrigins }) {
    return (
        <div
            className="fixed inset-0 x-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm mt-10"
            onClick={(e) => e.stopPropagation()}
        >
            <section className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6" >
                <div className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6" >
                    <div className="flex items-start justify-between gap-3" >
                        <div>
                            <h2 className="text-xl font-bold" >
                                CORS settings
                            </h2>
                            <p className="mt-1 text-sm text-muted" >
                                {project.name}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(false)
                                setError("")
                            }}
                            className="rounded-lg p-2 text-muted hover:bg-input"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="mt-5 rounded-xl border border-border bg-input p-3" >
                        <div className="flex items-center justify-between text-sm" >
                            <span className="text-muted" >
                                Configured origins
                            </span>
                            <span className="font-medium" >
                                {origins.length}/5
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border" >
                            <div
                                className="h-full rounded-full bg-accent transition-all"
                                style={{
                                    width: `${origins.length * 20}%`
                                }}
                            />
                        </div>
                    </div>
                    {error && (
                        <p
                            role="alert"
                            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                        >
                            {error}
                        </p>
                    )}
                    <div className="mt-5 space-y-3" >
                        {origins.map((origin, index) => (
                            <div key={`${index}-${origin}`} className="rounded-xl border border-border p-3" >
                                {editIndex === index ? (
                                    <div className="space-y-3" >
                                        <input
                                            autoFocus
                                            value={editValue}
                                            onChange={(event) =>
                                                setEditValue(event.target.value)

                                            }
                                            onkeydown={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault()
                                                    saveEdit()
                                                }
                                            }}
                                            placeholder="https://hackclub.app"
                                            className="auth-input"
                                        />
                                        <div className="flex justify-end gap-2" >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditIndex(null)
                                                    setEditValue(null)
                                                }}
                                                className="rounded-lg border border-borderpx-3 py-2 text-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={saveEdit}
                                                className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black"
                                            >
                                                <Check size={15} />
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3" >
                                        <Globe
                                            size={17}
                                            className="shrink-0 text-accent"
                                        />
                                        <span className="min-w-0 flex-1 break-all text-sm" >
                                            {origin}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => startEditing(index)}
                                            title="Edit origin"
                                            className="rounded-lg p-2 text-muted hover:bg-input hover:text-accent"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteOrigin(index)}
                                            title="Delete origin"
                                            className="rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {origins.length === 0 && (
                            <div className="rounded-xl border border-dashed border border px-4 py-8 text-center" >
                                <Globe
                                    size={28}
                                    className="mx-auto text-muted"
                                />
                                <p className="mt-3 text-sm font-medium" >
                                    No allowed origins
                                </p>
                                <p className="mt-1 text-xs text-muted" >
                                    Project authentication requests from browsers will be blocked.
                                </p>
                            </div>
                        )}
                    </div>
                    <form
                        className="mt-5"
                        onSubmit={(event) => {
                            event.preventDefault()
                            addOrigin();
                        }}
                    >
                        <label className="text-sm font-medium" >
                            Add a frontend origin
                        </label>
                        <div className="mt-2 flex gap-2" >
                            <input
                                type="url"
                                value={newOrigin}
                                onChange={(event) =>
                                    setNewOrigin(event.target.value)
                                }
                                disabled={origins.length >= 5}
                                placeholder="https://example.com"
                                className="auth-input min-w-0 flex-1"
                            />
                            <button
                                type="submit"
                                disabled={
                                    origins.length >= 5 ||
                                    !newOrigin.trim()
                                }
                                className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-black hover:bg-accent-hover disabled:opacity-50"
                            >
                                <Plus size={17} />
                                Add
                            </button>
                        </div>
                        <p>
                            Enter the exact origin, including the protocol.
                            Example: http://localhost:5173. Do not include
                            such as /login
                        </p>
                    </form>
                    <div className="mt-6 flex gap-3 border-t border-border pt-5" >
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(false)
                                setError("")
                            }}
                            disabled={saving}
                            className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-input"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={saveOrigins}
                            disabled={saving || editIndex !== null}
                            className="flex flex-1 items-center text-center pl-20 jusitify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold
                        text-black hover:bg-accent-hover disabled:opacity-50"
                        >
                            {
                                saving ? (
                                    <LoaderCircle
                                        size={17} className="animate-spin"
                                    />
                                ) : (
                                    <Save size={17} />
                                )
                            }
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )

}