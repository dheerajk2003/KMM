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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect} from "react";
//import { useNavigate } from "react-router-dom";


function App() {
  
  //const navigate = useNavigate();
  useEffect(() => {
    
  }, []);

  return (
    <div className=" min-h-screen">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feed" element={<Home /> } />
            <Route path="/nav" element={<Nav />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Registration />} />
            <Route path="/biodata" element={<GetBio />} />
            <Route path="/info/:userId" element={<UserInfo />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/editbio" element={<EditBio />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
