import { Outlet, Navigate, useAsyncValue } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";


//Archivo de autenticacion; verifica si es el usuario y si no, lo redirecciona al Login
export default function ProtectedRoute() {
    const auth = useAuth()
    return auth.isAuthenticated ? <Outlet /> : <Navigate to="/" /> //Hooks desde AuthProvider
}