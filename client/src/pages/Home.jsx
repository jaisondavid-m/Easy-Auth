import React from "react"
import { useNavigate } from "react-router-dom"

const stars = [
    { left: "10%", size: 48, duration: "7s", delay: "0s" },
    { left: "28%", size: 36, duration: "6s", delay: "1s" },
    { left: "52%", size: 32, duration: "8s", delay: "2s" },
    { left: "75%", size: 52, duration: "5.5s", delay: "3s" },
    { left: "90%", size: 26, duration: "6s", delay: "1.5s" }
] 

export default function Home() {
    const navigate = useNavigate()
    return (
        <div className="relative min-h-[80vh] overflow-hidden flex flex-col justify-center items-center gap-5 border" >
            {stars.map((star,index) => (
                <img
                    key={index}
                    src="/star.png"
                    alt=""
                    className="absolute top-0 animate-float"
                    style={{
                        left: star.left,
                        width: `${star.size}px`,
                        animationDuration: star.duration,
                        animationDelay: star.delay,
                    }}
                />
            ))}
            <h1 className="text-7xl font-bold" >Authentication made simple</h1>
            <h2 className="text-7xl font-bold tracking-tight" >So You can focus on building</h2>
            <button
                onClick={() => navigate("/docs")}
                className="border border-border px-5 py-3 rounded-xl bg-[#a3e635] font-bold text-3xl mt-5 hover:bg-white hover:text-[#a3e635] hover:border-[#a3e635] transition"
            >
                Get Started
            </button>
        </div>
    )
}