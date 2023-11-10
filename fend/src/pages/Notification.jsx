import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { NavLink } from "react-router-dom";
export default function Notification(){

    const token = localStorage.getItem("KMMtoken");
    const decodedToken = jwt_decode(token);
    const [requestors, setRequestors] = useState([]);
    useEffect(() => {
        getNoti();
    },[])

    async function getNoti(){
        const responce = await fetch("http://localhost:4000/getRequests", {
            method: "POST",
            headers: {
                "auth-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({person: decodedToken})
        })
        const data = await responce.json();
            console.log(data);
            if(data.length> 0){
                setRequestors(data);
            }
    }
    function Mappit(){
       return requestors.map((item) => {
            return (<div className="hello">
                <NavLink to={`/info/${item.requestorId}`}>{item.requestorName}</NavLink>
            </div>)
        })
    }
    return (
        <>
            <Mappit />
        </>
    );
}