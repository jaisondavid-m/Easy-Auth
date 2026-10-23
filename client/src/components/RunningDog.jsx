import React from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

function RunningDog() {
    return (
        <div className="dog-running-track" >
            <div className="running-dog" >
                <DotLottieReact
                    src="/lottie/original_doggie.lottie"
                    autoplay
                    loop
                    style={{ width: 90, height: 70 }}
                />
            </div>
        </div>
    )
}

export default RunningDog