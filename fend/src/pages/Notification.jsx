import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { NavLink } from "react-router-dom";
import Nav from './Nav'
import { RedSmallButton } from "../components/buttons/redButton";

export default function Notification() {

    const token = localStorage.getItem("KMMtoken");
    const decodedToken = jwt_decode(token);
    const [requestors, setRequestors] = useState([]);
    useEffect(() => {
        getNoti();
    }, [])

    async function getNoti() {
        const responce = await fetch("http://localhost:4000/getRequests", {
            method: "POST",
            headers: {
                "auth-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ person: decodedToken })
        })
        const data = await responce.json();
        if (data.length > 0) {
            setRequestors(data);
        }
    }

    async function acceptReq(requestorId) {
        // e.preventDefault();
        await fetch("http://localhost:4000/accecptReq", {
            method: "POST",
            headers: {
                "auth-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ person: decodedToken, requestor: requestorId })
        })
    }

    async function deleteReq(requestorId) {
        await fetch("http://localhost:4000/deleteReq", {
            method: "POST",
            headers: {
                "auth-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ person: decodedToken, requestor: requestorId })
        })
    }

    function Mappit() {
        return requestors.map((item) => {
            return (<div className="flex justify-between mx-2 my-3">
                <NavLink
                    to={`/info/${item.requestorId}`}
                    className="text-lg font-medium text-rose-400">
                    {item.requestorName}</NavLink>
                <div className="flex justify-end gap-1">
                    {/* <button onClick={() => { acceptReq(item.requestorId) }}>Accept</button> */}
                    <RedSmallButton name={"Accept"} 
                        func={() => {
                        acceptReq(item.requestorId);
                        getNoti()}}
                    ></RedSmallButton>

                    {/* <button onClick={() => { deleteReq(item.requestorId) }}>Ignore</button> */}

                    <RedSmallButton name={"Ignore"} 
                        func={() => {
                        deleteReq(item.requestorId) 
                        getNoti()
                    }} btncss={{backgroundColor: "gray"}}></RedSmallButton>
                </div>
            </div>)
        })
    }
    return (
        <>
            <Nav />
            <div className="w-96 m-auto">
                <h3 className="text-3xl font-bold text-center mb-5 text-slate-600">Notifications</h3>
                <Mappit />
            </div>
        </>
    );
}