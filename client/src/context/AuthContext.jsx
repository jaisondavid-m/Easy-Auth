import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"
import api from "../api/axios.js"
import { login as loginService, logout as logoutService, register as registerService } from "../services/authServices.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

    const [user,SetUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem("access_token")
        if (!token){
            SetUser(null)
            return null
        }
        try {
            const response = await api.get("/auth/profile")
            const profile = response.data?.user

            if (!profile) {
                throw new Error("Profile missing from API response")
            }
             
            SetUser(profile)
            return profile
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("access_token")
                SetUser(null)
            } 
            throw error;
        }
    },[]);

    const login = async (credentials) => {
        const data = await loginService(credentials)
        SetUser(data.user ?? null)
        return data
    }

    const register = async (credentails) => {
        const data = await registerService(credentails)
        SetUser(data.user ?? null)
        return data
    }

    const logout = () => {
        logoutService()
        SetUser(null)
    }


    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (localStorage.getItem("access_token")) {
                    await fetchProfile();
                }
            } catch(error) {
                console.error("Failed to restore session:",error)
            }
            finally {
                setLoading(false)
            }
        }
        initializeAuth();
    }, [fetchProfile])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                fetchProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context;
}