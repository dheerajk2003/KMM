import { Link, NavLink } from "react-router-dom";
import { takeBioData } from "./globalFuncs";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState({});

  useEffect(() => {
    takeBioData((error, data) => {
      if (error) {
        console.log(error);
      }
      if (data) {
        setUser(data);
      }
    });
  }, []);

  return (
    <>
      <nav className="w-full h-16 mb-10 flex flex-row justify-between items-center ">
        <Link to="/" className="text-blue-700 m-1 mx-5 text-3xl font-bold">
          KMM
        </Link>
        
        <NavLink to={`/info/${user.id}`} className="h-12 w-12 mx-5 rounded-full overflow-hidden ">
          <img
            src={`http://localhost:4000/images/${user.image}`}
            alt="image"
            className="h-full object-cover"
          />
        </NavLink>
        {/* <Link to="/partner" className="text-blue-700 text-xl m-1">Partner</Link> */}
      </nav>
    </>
  );
}
