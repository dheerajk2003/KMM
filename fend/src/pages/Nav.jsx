import { Link } from "react-router-dom";
import { takeBioData } from "./globalFuncs";
import { useContext, useEffect, useState } from "react";

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
  // fetch(`http://localhost:4000/post${decodeToken}`, {
  //       method: "GET",
  //       headers: {
  //         "auth-token": `${token}`,
  //       },
  //     })
  //       .then((responce) => responce.json())
  //       .then((data) => {
  //         setUser(data);
  //         // alert("data recieved");
  //     });

  function handleClick(e){
    e.preventDefault();
    console.log(searchInput, typeInput);
  }

  return (
    <>
      <nav className="w-full h-20 mb-10 flex flex-row justify-end items-center ">
        <Link to="/" className="text-blue-700 text-xl m-1">
          KMM
        </Link>
        
        <div className="h-12 w-12 mr-5 rounded-full overflow-hidden ">
          <img
            src={`http://localhost:4000/images/${user.image}`}
            alt="image"
            className="h-full object-cover"
          />
        </div>
        {/* <Link to="/partner" className="text-blue-700 text-xl m-1">Partner</Link> */}
      </nav>
    </>
  );
}
