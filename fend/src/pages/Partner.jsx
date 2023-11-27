import { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { NavLink } from "react-router-dom";
import { takeBioData } from "./globalFuncs";
import { RedSmallButton } from "../components/buttons/redButton";
import { bioContext } from "../App";

export default function Partner() {
  const { biodata, setBiodata } = useContext(bioContext);
  const myToken = localStorage.getItem("KMMtoken");
  const id = jwt_decode(myToken);
  const [partnerList, setPartnerList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("");
  const [gen, setGen] = useState("");

  useEffect(() => {
    setGen(biodata.gender)

    fetch("http://localhost:4000/partner", {
      headers: {
        "auth-token": `${myToken}`,
        id: id,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((responce) => responce.json())
      .then((data) => {
        setPartnerList(data);
      });
  }, []);

  async function searchDb(e) {
    e.preventDefault();
    // takeBioData((error, Data) => {
    //   if(error){
    //     console.log(error);
    //   }
    //   setGen(Data.gender);
    // })

    if (!gen) {
      await fetch(`http://localhost:4000/post${id}`, {
        method: "GET",
        headers: {
          "auth-token": `${myToken}`,
        },
      })
        .then((responce) => responce.json())
        .then((data) => {
          setGen(data.gender);
          // alert("data recieved");
        });
    }

    console.log("from partner");
    console.log(gen);
    await fetch("http://localhost:4000/partner", {
      headers: {
        "auth-token": `${myToken}`,
        id: id,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ searchInput, searchType, gen }),
    })
      .then((responce) => responce.json())
      .then((data) => {
        setPartnerList(data);
      });
  }

  function Mappit() {
    const list = partnerList.map((l) => {
      return (
        <div className="my-3 mx-5 text-black bg-gray-100 h-auto rounded-3xl flex flex-row items-center justify-start border">
          <div className="h-60 w-60">
            <img
              src={`http://localhost:4000/images/${l.image}`}
              alt="not available"
              className="object-cover h-60 w-60 overflow-hidden rounded-3xl "
            />
          </div>
          <div className="ml-5">
            <h3 className=" font-bold text-3xl capitalize">{l.fullname}</h3>
            <div className="m-1 ml-3">
              <p className="text-gray-600">Age : {l.dob}</p>
              <p className="text-gray-600">Cast : {l.cast}</p>
              <p className="text-gray-600">Occupation : {l.occupation}</p>
              <p className="text-gray-600">Education : {l.education}</p>
              <RedSmallButton name={<NavLink to={`/info/${l.id}`}>See More</NavLink>} />
              {/* <NavLink to={`/info/${l.id}`} className="px-2 my-2 rounded-lg text-lg btnGrad text-primary-color ease-in-out duration-300 hover:scale-105">See More</NavLink> */}
            </div>
          </div>
        </div>
      );
    });
    return list;
  }

  return (
    <div className="w-screen h-auto flex flex-col m-0 p-0">
      <form id="searchForm" className="w-auto h-auto mx-auto bg-transparent translate-y-[-1.5rem]">
        <input
          className="bg-gray-300 h-10 px-3 w-64 rounded-md mx-1 shadow-lg"
          type="text"
          placeholder={`search by ${searchType}`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          defaultChecked="fullname"
          className="bg-gray-300 h-10 w-24 px-3 rounded-md mx1 shadow-lg"
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">None</option>
          <option value="fullname" selected={true}>Name</option>
          <option value="city">City</option>
          <option value="cast">Caste</option>
          <option value="occupation">Occupation</option>
        </select>
        <button onClick={searchDb}
          className="bg-gray-300 h-10 px-1 rounded-md mx-1 shadow-lg"
        >🔍</button>
      </form>
      <div className="max-w-screen-xl m-0 p-0 grid gap-2 sm:grid-cols-1 lg:grid-cols-2 text-black px-10">
        <Mappit />
      </div>
    </div>
  );
}
