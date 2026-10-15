import api from "../api/axios.js"

export const login = async (credential) => {

    const response = await api.post("/auth/login", credential)
    const token = response.data?.token

    if(!token) {
        throw new Error("Access token not found in response")
    }

    localStorage.setItem("access_token",token)

    return response.data
    
}

export const register = async (credential) => {

    const response = await api.post("/auth/register",credential)
    const token = response.data?.token

    if (token) {
        localStorage.setItem("access_token",token)
    }

    return response.data
}

export const logout = () => {
    localStorage.removeItem("access_token")
}