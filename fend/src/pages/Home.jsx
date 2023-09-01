import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function Home() {
  const [user, setUser] = useState({});
  const [myToken, setMyToken] = useState("");
  const [present, setPresent] = useState(false);

  function getInfo() {
    try {
      const token = localStorage.getItem("KMMtoken");
      setMyToken(token);
      if (myToken) {
        const decodedToken = jwt_decode(token);
        fetch(`http://localhost:4000/post${decodedToken}`, {
          method: "GET",
          headers: {
            "auth-token": `${token}`,
          },
        })
          .then((responce) => responce.json())
          .then((data) => {
            setUser(data);
            setPresent(true);
          });
      } else {
        setUser({
          id: "go to login page",
          username: "then login",
          email: "then come here again",
        });
        setPresent(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

  // if (parseInt(userIds) !== parseInt(user.id) && toString(user.id) !== "go to login page") {
  //     getInfo();
  //     console.log("in func" + userIds + " ,  " + user.id)
  // }

  if (!present) {
    getInfo();
  }

  function logOut() {
    if (myToken) {
      localStorage.removeItem("KMMtoken");
      setUser({
        id: "go to login page",
        username: "then login",
        email: "then come here again",
      });
    }
  }

  return (
    <div>
      <ul>
        <li>{user.id}</li>
        <li>{user.email}</li>
      </ul>
      <button
        onClick={logOut}
        style={{
          display: myToken ? "block" : "none",
        }}
      >
        Log out
      </button>
      <Link to="/biodata">Enter Biodata</Link>
      <Link to="/info">User Biodata</Link>
    </div>
  );
}
