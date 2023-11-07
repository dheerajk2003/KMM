import { useEffect } from "react"
import Login from "./Login"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

export default function Landing(){
    const navigate = useNavigate();
    useEffect(() => {
        const mytoken = localStorage.getItem("KMMtoken");
        if(mytoken != null){
            navigate("/feed");
        }
    });

    return (
        <div className="LanImg bg-fixed bg-center bg-no-repeat bg-cover w-screen h-screen flex flex-col items-center justify-center ">
            <nav className="w-screen h-12 absolute top-0 left-0 flex items-center justify-end ">
                <Link to="Login" className="mx-5 p-0 items-start font-semibold text-4xl font-titleFont">KMM</Link>
                <Link to="Login" className="mx-5 py-1 px-2 mr-10 font-medium items-end btnGrad rounded-lg text-primary-color ease-in-out duration-200 hover:scale-105">LOGIN</Link>
            </nav>
            <h1 className="mt-20 font-bold text-center text-6xl w-2/5">Your Perfect Match Awaits</h1>
            <p className="w-1/2 text-center m-5">Welcome to KMM, where your journey to finding lifelong love begins. Our platform is dedicated to helping individuals like you find their ideal life partner with ease and confidence.</p>
            <Link to="register" className="px-5 py-2 rounded-lg text-lg btnGrad font-medium text-primary-color ease-in-out duration-300 hover:scale-105 hover:">REGISTER</Link>
        </div>
    )
}