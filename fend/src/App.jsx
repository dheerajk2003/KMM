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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState} from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const myToken = localStorage.getItem("KMMtoken");
    if (myToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Home /> : <Landing />} />
            <Route path="/nav" element={<Nav />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/biodata" element={<GetBio />} />
            <Route path="/info/:userId" element={<UserInfo />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/editbio" element={<EditBio />} />
            <Route path="/landing" element={<Landing />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
