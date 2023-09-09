import { Link } from "react-router-dom"

export default function Nav(){
    return(
        <>
            <nav>
                <Link to="/" className="text-blue-700 text-xl m-1">KMM</Link>
                <Link to="/login" className="text-blue-700 text-xl m-1">Login</Link>
                <Link to="/register" className="text-blue-700 text-xl m-1">Register</Link>
                <Link to="/partner" className="text-blue-700 text-xl m-1">Partner</Link>
            </nav>
        </>
    )
}