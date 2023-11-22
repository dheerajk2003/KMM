import { Navigate } from "react-router-dom";
import Nav from "./Nav";
import Partner from "./Partner";
import RedButton from "../components/buttons/redButton";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { bioContext } from "../App";
export default function Home() {
  const navigate = useNavigate();
  const {biodata, setBiodata} = useContext(bioContext);

  return (
    <>
        <Nav />
        <div style={{display: biodata.id ? "none":"static"}} id="biodataNot" className="w-screen h-screen text-center text-xl">
            <h1>please enter biodata for furthur usage 
                <RedButton name={"Biodata"} func={() => {navigate("/biodata")}} />
            </h1>
        </div>
        <Partner />
    </>
  );
}
