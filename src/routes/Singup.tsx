import { useState } from "react"
import DefaultLayout from "../layout/DefaultLayout"
import { useAuth } from "../Auth/AuthProvider"
import { Navigate, useNavigate } from "react-router-dom"
import { API_URL } from "../Auth/Constans"
import { AuthResponseError } from "../types/Types"

export default function SingUp() {

    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorResponse, setErrorResponse] = useState("")
    
    const auth = useAuth()
    const goTo = useNavigate()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    username,
                    password
                })
            })
            if (response.ok) { 
                console.log('Usuario Creado Correctamente') 
                setErrorResponse("")
                goTo("/")
            }
            else { 
                console.log('No se puedo crear el Usuario, error Signup') 
            }
            const json = await response.json() as AuthResponseError
            setErrorResponse(json.body.error)
        } catch (error) {
            console.log(error)
        }
    }

    if (auth.isAuthenticated) { return <Navigate to="/dashboard" /> }

    return <DefaultLayout>
        <form className="form" onSubmit={handleSubmit}>
            <h1>Registro</h1>
            {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} />

            <label>Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />

            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />

            <button>Crear Usuario</button>
        </form>
    </DefaultLayout>
}