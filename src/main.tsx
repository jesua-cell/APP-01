import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login.tsx'
import SingUp from './routes/Singup.tsx'
import Dashboard from './routes/Dashboard.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import { AuthProvider } from './Auth/AuthProvider.tsx'

//Rutas 
//Login
//Singup
//Dashboar: (Ruta Protegida) Archivo de atunticacion; dejara ingresar al usuario

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SingUp />
  },
  {
    path: "/",
    element: <ProtectedRoute />, //Verificacion en el archivo: ProtectedRoute.tsx
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      }
    ]
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
