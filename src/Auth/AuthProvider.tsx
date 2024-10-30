import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/Types";
import { API_URL } from "./Constans";

//Manejo global de la autenticacion de las rutas

interface AuthPrivederProps {
    children: React.ReactNode
}

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => { },
    saveUser: (userData: AuthResponse) => { },
    getRefreshToken: () => { },
    getUser: () => ({} as User || undefined),
    signOut: () => { }
})

export function AuthProvider({ children }: AuthPrivederProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [accesToken, setAccessToken] = useState<string>("")
    const [user, setUser] = useState<User>()
    const [isLoading, setIsLoading] = useState(true)
    // const [refreshToken, setRefreshToken] = useState<string>("")

    //Validar la autenticacion de la aplicacion
    useEffect(() => {
        checkAuth();
    }, []);

    async function requestNewAccessToken(refreshToken: string) {
        try {
            const response = await fetch(`${API_URL}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`
                }
            })

            if (response.ok) {
                const json = (await response.json()) as AccessTokenResponse

                if (json.error) {
                    throw new Error(json.error)
                }
                return json.body.accessToken
            } else {
                throw new Error(response.statusText)
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    //Solicito HTTP de la info del usuario
    async function getUserInfo(accessToken: string) {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (response.ok) {
                const json = await response.json()

                if (json.error) {
                    throw new Error(json.error)
                }
                return json.body
            } else {
                throw new Error(response.statusText)
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    //Verificar si esta autenticado
    async function checkAuth() {
        if (accesToken) {
            const userInfo = await getUserInfo(accesToken)
            if (userInfo) {
                saveSessionInfo(userInfo, accesToken, getRefreshToken()!)
                setIsLoading(false)
                return
            }
        } else {
            const token = getRefreshToken()
            if (token) {
                const newAccessToken = await requestNewAccessToken(token)
                if (newAccessToken) {
                    const userInfo = await getUserInfo(newAccessToken)
                    if (userInfo) {
                        saveSessionInfo(userInfo, newAccessToken, token)
                        setIsLoading(false)
                        return
                    }
                }
            }
        }
        setIsLoading(false)
    }

    function signOut() {
        setIsAuthenticated(false),
            setAccessToken(""),
            setUser(undefined),
            localStorage.removeItem("token")
    }

    function saveSessionInfo(
        userInfo: User,
        accessToken: string,
        refreshToken: string) {
        setAccessToken(accessToken)
        localStorage.setItem("token", JSON.stringify(refreshToken))
        setIsAuthenticated(true)
        setUser(userInfo)
    }

    function getAccessToken() {
        //Puede que por aqui esté el error, ya que estas tratando de obtener el token de una variable que se borra cada vez que la pagina se recarga
        //Intenta obtener el token usando localStorage.getItem('token') para que lo obtengas del localStorage que no se borra cuando recargas la pagina.
        return accesToken
    }

    function getRefreshToken(): string | null {
        const tokenData = localStorage.getItem("token")
        if (tokenData) {
            const token = JSON.parse(tokenData)
            return token
        }
        return null
    }

    function saveUser(userData: AuthResponse) {
        saveSessionInfo(
            userData.body.user,
            userData.body.accessToken,
            userData.body.refreshToken
        )
    }

    function getUser() {
        return user
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            getAccessToken,
            saveUser,
            getRefreshToken,
            getUser,
            signOut,
        }}>
            {isLoading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext) //Hooks: para el manejo de los componentes del AuthProvider
