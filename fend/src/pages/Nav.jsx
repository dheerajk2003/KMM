import { Link } from "react-router-dom"

export default function Nav(){
    return(
        <>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/partner">Partner</Link>
            </nav>
        </>
    )
}