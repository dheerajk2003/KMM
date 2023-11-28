import "./App.css";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Nav from "./pages/Nav";
import GetBio from "./pages/GetBio";
import UserInfo from "./pages/UserInfo";
import Partner from "./pages/Partner";
import EditBio from "./pages/EditBio";
import Menu from "./pages/Menu";
import Notification from "./pages/Notification";
import RedButton from "./components/buttons/redButton";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
//import { useNavigate } from "react-router-dom";
export const bioContext = createContext();

function App() {
  const token = localStorage.getItem("KMMtoken");
  
  const [age, setAge] = useState({});
  const [biodata, setBiodata] = useState({});
  let decodeToken;
  //const navigate = useNavigate();
  useEffect(() => {
    if(token){
      decodeToken = jwt_decode(token);
      getBiodata();
    }
    
  }, []);

  async function getBiodata() {
    fetch(`http://localhost:4000/post${decodeToken}`, {
      method: 'GET',
      headers: {
        "auth-token": `${token}`
      }
    })
      .then(responce => responce.json())
      .then((data) => {
        if(data.id){
          setBiodata(data);
        }
        else{
          console.log("app.jsx not found bio");
        }
      });
  }

  return (
    <>
      <div id="responsiveDiv" className="w-screen h-screen text-center text-xl">
        <h1>Please turn on desktop mode<br />OR<br />Use a computer</h1>
      </div>

      <div className=" min-h-screen" id="unresDiv">
        <bioContext.Provider value={{ biodata,setBiodata }}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/feed" element={<Home />} />
              <Route path="/nav" element={<Nav />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/biodata" element={<GetBio />} />
              <Route path="/info/:userId" element={<UserInfo />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/editbio" element={<EditBio />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/menu" element={<Menu />} />
            </Routes>
          </HashRouter>
        </bioContext.Provider>
      </div>
    </>
  );
}

export default App;
