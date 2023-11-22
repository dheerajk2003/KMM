import { Link, NavLink } from "react-router-dom";
import { takeBioData } from "./globalFuncs";
import { useContext, useEffect, useState } from "react";
import { bioContext } from "../App";
import jwt_decode from "jwt-decode";

export default function Nav() {
  const token = localStorage.getItem("KMMtoken");
  const decodedToken = jwt_decode(token);
  const { biodata, setBiodata } = useContext(bioContext);
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    console.log(biodata, "inside nav");
    setUser(biodata);
    if (!biodata.id) {
      console.log("not bio in nav");
      takeBioData((error, data) => {
        if (error) {
          console.log(error);
        }
        if (data) {
          setUser(data);
        }
      });
    }
    getNoti();
  }, []);

  async function getNoti() {
    if(user){
      console.log("inside getNoti");
      const responce = await fetch("http://localhost:4000/getRequests", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ person: decodedToken })
      })
      const data = await responce.json();
      console.log(data, "from get Noti");
      if (data.length > 0) {
        console.log("inside if con get Noti");
        setNotifications(true);
      }
    }
  }

  return (
    <>
      <nav className="w-full h-16 mb-8 flex flex-row justify-between items-center ">
        <Link to="/" className="text-rose-500 m-1 mx-5 text-4xl font-bold">
          KMM
        </Link>
        
        <Link to="/notification" style={{display: notifications ? "block" : "none"}} >
          <div  className="bg-rose-600 h-10 w-24">{`${notifications}`}</div>
        </Link>

        <Link to="/menu" className="h-12 w-12 mx-5 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src={`http://localhost:4000/images/${user.image}`}
            alt="image"
            className="h-full object-cover"
          />
        </Link>
        {/* <Link to="/partner" className="text-blue-700 text-xl m-1">Partner</Link> */}
      </nav>
    </>
  );
}
