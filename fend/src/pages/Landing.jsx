import { useEffect, useState } from "react"
import Login from "./Login"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { RedSmallButton } from "../components/buttons/redButton";
import RedButton from "../components/buttons/redButton";

export default function Landing() {
    const navigate = useNavigate();
    const [isScaled,setIsScaled] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() =>{
            setIsScaled(!isScaled);
        },500);
        const mytoken = localStorage.getItem("KMMtoken");
        if (mytoken != null) {
            navigate("/feed");
        }
    });

    return (
        <div className="w-screen h-screen flex flex-col items-start justify-center pl-32">
            <nav className="w-screen h-12 absolute top-0 left-0 flex items-center justify-between p-5 m-5">
                <Link to="Login" className="text-rose-500 m-1 mx-3 text-4xl font-bold">KMM</Link>
                {/* <Link to="Login" className="mx-5 py-1 px-2 mr-10 font-medium items-end btnGrad rounded-lg text-primary-color ease-in-out duration-200 hover:scale-105">LOGIN</Link>
                <RedSmallButton name={"Login"} func={() => {navigate("/login")}} /> */}
                <RedButton name={"Login"} func={() => { navigate("/login") }} btncss={{ marginRight: "4em" }} />
            </nav>
            <div className="w-1/2 h-full z-10 flex flex-col items-start justify-center gap-5">
                <h1 className="mt-20 text-slate-900 font-bold text-start text-6xl w-full">Your Perfect Match Awaits</h1>
                <p className="w-full text-slate-900 text-start">Welcome to Khatri Mitti Maiti Site, where your journey to finding lifelong love begins. Our platform is dedicated to helping individuals like you find their ideal life partner with ease and confidence.</p>
                <Link to="register" className="w-44 h-10 text-white align-middle bg-rose-600 hover:shadow-lg hover:shadow-rose-400 active:scale-105 focus:outline-none focus:ring-none text-base font-bold  px-4 py-2 text-center">REGISTER</Link>
            </div>
            <div className="w-1/2 absolute right-0 bottom-0">
                <img src="kmmLan.png" style={{ filter: "drop-shadow(#f99 0px 0px 20px)" }} />
            </div>
            <img src="svgs/circle2.svg" id="circle" className="absolute -left-52 top-1/4" />
            <img src="svgs/heart.svg" 
            style={{scale: isScaled ? "1" : "1.2", transition: 'transform 0s'}} 
            className="absolute top-12 right-52" id="heart" />
            <svg id="arrow" className="w-44 h-44 absolute bottom-5 left-52" width="238" height="151" viewBox="0 0 238 151" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 135.148C44.1666 135.148 111.124 144.143 111.124 103.677C111.124 90.311 108.268 76.2106 89.8733 80.1833C69.5868 84.5644 75.4026 111.278 86.9498 120.396C104.571 134.31 127.776 135.608 150.029 135.148C164.465 134.85 182.705 130.272 195.792 124.548C207.501 119.428 211.76 114.972 215.357 103.786C219.358 91.3426 226.573 62.8018 217.943 50.5701C207.951 36.4096 196.537 25 177.914 25" stroke="#ff4940" stroke-width="3" stroke-linecap="round" />
            </svg>
        </div>
    )
}