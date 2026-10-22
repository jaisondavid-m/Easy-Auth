import React, { useState } from "react"
import {
    BookOpen,
    Check,
    Copy,
    ShieldCheck,
    Code2,
    Globe,
    KeyRound,
    UserPlus,
    LogIn,
    AlertCircle,
} from "lucide-react"

const API_URL = "https://ecauth.bitsathy.in"

const sections = [
    { id: "quick-start", label: "Getting started" },
    { id: "configuration", label: "Connect your app" },
    { id: "register", label: "Create an account" },
    { id: "login", label: "Log in" },
    { id: "protected", label: "Protected requests" },
    { id: "logout", label: "Logout" },
    { id: "cors", label: "Fix CORS issues" },
    { id: "errors", label: "Troubleshooting" }
]

const snippets = {
    install: `npm install axios`,
    config: `// src/axios/ecAuth.js
import axios from "axios"

export const ecAuth = axios.create({
    baseURL: "https://ecauth.bitsathy.in/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
})
    
export const PROJECT_ID = "YOUR_PROJECT_ID"

export function saveToken(token) {
    localStorage.setItem("ec_auth_token", token)
}
    
export function logout() {
    localStorage.removeItem("ec_auth_token")
}

export async function register(name, email, password) {
    const response = await ecAuth.post(
        \`/projects/\${PROJECT_ID}/auth/register\`,
        {name,email,password}
    )
    return response.data
}

export async function login(email,password) {
    const response =  await ecAuth.post(
        \`/projects/\${PROJECT_ID}/auth/login\`,
        {email,password}
    )
    const token = response.data?.token
    if (!token) {
        throw new Error("The API did not return a token")
    }
    saveToken(token)
    return response.data
}

export async function getProjectData(path) {
    const token = localStorage.getItem("ec_auth_token")
    if (!token) {
        throw new Error("Please login first.")
    }
    return ecAuth.get(path, {
        headers: {
            Authorization: \`Bearer \${token}\`,
        }
    },
)}
`,
    register: `import {register} from "./axios/ecAuth.js"
async function handleRegister() {
    try {
        const result = await register(
            "user's name",
            "user@stardance.com",
            "Passwordispassword"
        )
        console.log("Registration successful:",result)
    } catch (error) {
        console.error(error.response?.data?.error)
    }
}    
`,
    login: `import {login} from "./axios/ecAuth.js"
async function handleLogin() {
    try {
        const result = await login(
            "user@stardance.com",
            "Passwordispassword"
        )
        console.log("Login successful:",result)
    } catch (error) {
        console.error(error.response?.data?.error) 
    }
}`,
    protected: `import {getProjectData} from "../axios/ecAuth.js"
async function loadData() {
    try {
        const response = await getProtectedData(
            "/ur-project-protected-endpoing"
        )
        console.log(response.data)
    } catch (error) {
        if (error.response?.status === 401)  {
            console.log("Please log in.")
        }else {
            console.error(error.response?.data?.error)
        }
    }
}`,
    logout: `import {logout} from "../axios/evAuth.js"
function handleLogout() {
    logout()
    window.location.href = "/login"
}`,
}

export default function Docs() {
    const [active, setActive] = useState("quick-start")
    return (
        <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8" >
            <div className="mx-auto max-w-7xl" >
                <div className="mb-8 flex items-startt gap-4" >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent" >
                        <BookOpen size={25} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-accent" >
                            EC-AUTH FOR DEVELOPERS
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight" > 
                            Connect your app to EC-Auth
                        </h1>
                        <p className="mt-3 max-w-2xl leading-7 text-muted" >
                            Use EC-Auth to handle sign-up and login in your app. Follow the steps below to connect your project.
                        </p>
                    </div>
                </div>
                <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]" >
                    <aside className="h-fit rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-24" >
                        <nav className="space-y-1" >
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    onClick={() => setActive(section.id)}
                                    className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                                        active === section.id
                                            ? "bg-accent/10 font-medium text-accent"
                                            : "text-muted hover:bg-input hover:text-foreground"
                                    }`}
                                >
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </aside>
                    <div className="min-w-0 rounded-2xl border broder-border bg-card px-5 sm:px-8" >
                        <Section
                            id="quick-start"
                            title="1. Quick start"
                            description="A few things to do before you start writing code."
                        >
                            <div className="grid gap-3 sm:grid-cols-2" >
                                {[
                                    {
                                        icon: <ShieldCheck size={20} />,
                                        title: "Create an account",
                                        text: "Log in to your EC-Auth dashboard.",
                                    },
                                    {
                                        icon: <Code2 size={20} />,
                                        title: "Create a project",
                                        text: "Create a project for the app you want to connect.",
                                    },
                                    {
                                        icon: <KeyRound size={20} />,
                                        title: "Copy your project ID",
                                        text: "Copy the project ID From your project card.",
                                    },
                                    {
                                        icon: <Globe size={20} />,
                                        title: "Configure your origin",
                                        text: "Add your frontend URL under Manage CORS origins.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="rounded-xl border border-border p-4" >
                                        <div className="mb-3 text-accent" >{item.icon}</div>
                                        <h3 className="font-semibold" >{item.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted" >{item.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-6" >
                                <strong>Before you start:</strong> Replace the sample backend URL and project ID with your own. Never put your JWT secret in frontend code.
                            </div>
                        </Section>
                        <Section
                            id="configuration"
                            title="2. Install and configure"
                            description="This example users Axios and regular JavaScript imports. You can use the same approach in React, Vite or another JS app."
                        >
                            <CodeExample code={snippets.install} language="bash" />
                            <p className="text-sm font-medium" >Create `src/axios/ecAuth.js`</p>
                            <CodeExample code={snippets.config} />
                            <p className="text-sm leading-6 text-muted" >
                                Change `YOUR-BACKEND-DOMAIN` to your deployed API
                                hostname, without the `/api/v1` suffix. The helper
                                adds that prefix itself. Keep the project ID as a
                                string.
                            </p>
                        </Section>
                        <Section
                            id="register"
                            title="3. Register a user"
                            description="When someone signs up, send their name, email and password to this endpoint."
                        >
                            <div className="flex items-center gap-2 text-sm text-muted" >
                                <UserPlus size={17} className="text-accent" />
                                <code className="break-all text-foreground" >
                                    /api/v1/projects/{`{projectID}`}/auth/register
                                </code>
                            </div>
                            <CodeExample code={snippets.register} />
                            <p className="text-sm leading-6 text-muted" >
                                This example sends `name`,`email` and `password`. Check your backend handler to confirm the acceptes fields and whether sign-up also returns a token.
                            </p>
                        </Section>
                        <Section
                            id="login"
                            title="4. Login"
                            description="Send the user's email and password to login. If login succeeds, save the token returned by your API."
                        >
                            <div className="flex items-center gap-2 text-sm text-muted" > 
                                <LogIn size={17} className="text-accent" />
                                <span>POST</span>
                                <code className="break-all text-foreground" >
                                    /api/v1/projects/{`{projectID}`}/auth/login
                                </code>
                            </div>
                            <CodeExample code={snippets.login} />
                            <p className="text-sm leading-6 text-muted" >
                                The code looks for a field named `token` in the login response. If your API uses a different field name, update that line to match.
                            </p>
                        </Section>
                        <Section
                            id="protected"
                            title="5. Make authenticated requests"
                            description="For an endpoint that requires login, send the token in the `Authorization` header. Make sure the endpoint accepts project-user tokens."
                        >
                            <CodeExample code={snippets.protected} />
                            <div className="rounded-xl border border-border bg-input/50 p-4 text-sm leading-6" >
                                <strong>One thing to check:</strong> Your current `/api/v1/auth/profile` route uses dashboard authentication. It may not accepts token issued to users of an individual project. Use an endpoint protected by your project-user authentication middleware.
                            </div>
                        </Section>
                        <Section
                            id="logout"
                            title="6. Log out"
                            description="When the user logs out, remove their saved token."
                        >
                            <CodeExample code={snippets.logout} />
                            <p className="text-sm leading-6 text-muted" >
                                This removes the token from the browser, but it does not invalidate the JWT on the server.
                            </p>
                        </Section>
                        <Section
                            id="cors"
                            title="7. Configure CORS"
                            description="If your browser block a request, check that your app's URL is listed in the project's allowed origins."
                        >
                            <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted" >
                                <li>Open the Projects page in your dashboard.</li>
                                <li>Select Manage CORS origins.</li>
                                <li>Add the exact origin, such as `http://localhost:5173`.</li>
                                <li>For producation, add your deployed frontend origin, such as `http://stardance.hackclub.app`.</li>
                                <li>Save your changes and retry the request.</li>
                            </ol>
                            <p className="text-sm leading-6 text-muted" >
                                Enter only the scheme, hostname and optional port.
                                Do not add a page path such as `/login`. CORS is 
                                browser security policy, not a replacement for 
                                API authentication.
                            </p>
                        </Section>
                        <div className="py-8" >
                            <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4" >
                                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent" />
                                <div>
                                    <h3 className="font-semibold" >A few things to keep in mind</h3>
                                    <p>
                                        Use HTTPS in producation and check permissions on the backend. Never expose your JWT secret or database credentials in frontend code. For better security, avoid keeping long-lived tokens in `localStorage`
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </main>
    )
}

function CodeExample({ code, language = "javascript" }) {

    const [copied, setCopied] = useState(false)

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(false)
        }
    }
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-zinc-950" >
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3" >
                <span className="text-xs text-zinc-400" >{language}</span>
                <button
                    onClick={copyCode}
                    className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white"
                >
                    {copied ? <Check size={14} /> : <Copy size={14}/>}
                    {copied ? "Copied" : "Copy Code"}
                </button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-6 text-zinc-200" >
                <code>{code}</code>
            </pre>
        </div>
    )
}

function Section({ id, title, description, children }) {
    return (
        <section id={id} className="scroll-mt-28 border-b border-border py-8 " >
            <h2 className="text-xl font-bold tracking-tight" >{title}</h2>
            {description && (
                <p className="mt-2 leading-7 text-muted" >{description}</p>
            )}
            <div className="mt-5 space-y-4" >{children}</div>
        </section>
    )
}