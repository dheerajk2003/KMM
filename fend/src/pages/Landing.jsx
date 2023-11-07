import { useEffect } from "react"
import Login from "./Login"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { RedSmallButton } from "../components/buttons/redButton";
import RedButton from "../components/buttons/redButton";

export default function Landing(){
    const navigate = useNavigate();
    useEffect(() => {
        const mytoken = localStorage.getItem("KMMtoken");
        if(mytoken != null){
            navigate("/feed");
        }
    });

    return (
        <div className="w-screen h-screen flex flex-col items-start justify-center pl-32">
            <nav className="w-screen h-12 absolute top-0 left-0 flex items-center justify-between p-5 m-5">
                <Link to="Login" className="text-rose-500 m-1 mx-3 text-4xl font-bold">KMM</Link>
                {/* <Link to="Login" className="mx-5 py-1 px-2 mr-10 font-medium items-end btnGrad rounded-lg text-primary-color ease-in-out duration-200 hover:scale-105">LOGIN</Link>
                <RedSmallButton name={"Login"} func={() => {navigate("/login")}} /> */}
                <RedButton name={"Login"} func={() => {navigate("/login")}} btncss={{marginRight : "4em"}} />
            </nav>
            <div className="w-1/2 h-full flex flex-col items-start justify-center gap-5">
                <h1 className="mt-20 text-slate-900 font-bold text-start text-6xl w-full">Your Perfect Match Awaits</h1>
                <p className="w-full text-slate-900 text-start">Welcome to KMM, where your journey to finding lifelong love begins. Our platform is dedicated to helping individuals like you find their ideal life partner with ease and confidence.</p>
                <Link to="register" className="w-44 h-10 text-white align-middle bg-rose-600 hover:shadow-lg hover:shadow-rose-400 active:scale-105 focus:outline-none focus:ring-none text-base font-bold  px-4 py-2 text-center">REGISTER</Link>
            </div>
            <div className="w-1/2 absolute right-0 bottom-0">
                <img src="kmmLan.png" />
            </div>
        </div>
    )
}