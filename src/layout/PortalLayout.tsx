import { useAuth } from "../Auth/AuthProvider";
import { Link } from "react-router-dom"
import { API_URL } from "../Auth/Constans";

export default function PortalLayout({ children }: { children: { children: React.ReactNode } }) {

    const auth = useAuth()

    async function handleSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault()

        try {
            const response = await fetch(`${API_URL}/signout`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${auth.getRefreshToken()}`
                }
            })

            if(response.ok){
                auth.signOut()
            }

        } catch (error) {

        }

    }

    return (
        <>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/me">Profile</Link>
                        </li>
                        <li>
                            <Link to="/me">{auth.getUser()?.username ?? ""}</Link>
                        </li>
                        <li>
                            <a href="#" onClick={handleSignOut}>
                                Sign out
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>{children}</main>
        </>
    )
}