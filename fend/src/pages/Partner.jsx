import { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { NavLink } from "react-router-dom";

export default function Partner() {
  const myToken = localStorage.getItem("KMMtoken");
  const id = jwt_decode(myToken);
  const [partnerList, setPartnerList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
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

  function searchDb(e) {
    e.preventDefault();
    fetch("http://localhost:4000/partner", {
      headers: {
        "auth-token": `${myToken}`,
        id: id,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ searchInput, searchType }),
    })
      .then((responce) => responce.json())
      .then((data) => {
        setPartnerList(data);
      });
  }

  function Mappit() {
    const list = partnerList.map((l) => {
      return (
        <div className="my-3 text-black bg-gray-100 h-auto rounded-3xl flex flex-row items-center justify-start shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <div className="h-52 w-52">
            <img
              src={`http://localhost:4000/images/${l.image}`}
              alt="not available"
              className="object-cover h-52 w-52 overflow-hidden rounded-3xl " 
            />
          </div>
          <div className="ml-10">
            <h3 className=" font-bold text-3xl capitalize">{l.fullname}</h3>
            <div className="m-1 ml-3">
              <p className="">Age : {l.dob}</p>
              <p>Cast : {l.cast}</p>
              <p>Occupation : {l.occupation}</p>
              <p>Education : {l.education}</p>
              <NavLink to={`/info/${l.id}`} className="px-2 my-2 rounded-lg text-lg btnGrad text-primary-color ease-in-out duration-300 hover:scale-105">See More</NavLink>
            </div>
          </div>
        </div>
      );
    });
    return list;
  }

  return (
    <div className="max-w-screen-xl m-auto grid gap-2 sm:grid-cols-1 lg:grid-cols-2 text-black px-10">
      <form id="searchForm" className="w-auto h-auto absolute top-0 right-24 my-5 bg-transparent">
        <input
          className="bg-gray-300 h-7 px-3 rounded-md mx-1 shadow-lg"
          type="text"
          placeholder={`search by ${searchType}`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          defaultChecked="fullname"
          className="bg-gray-300 h-7 w-5 px-3 rounded-md mx1 shadow-lg"
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">None</option>
          <option value="fullname">Name</option>
          <option value="city">City</option>
          <option value="cast">Caste</option>
          <option value="occupation">Occupation</option>
        </select>
        <button onClick={searchDb} 
          className="bg-gray-300 h-7 px-1 rounded-md mx-1 shadow-lg"
        >🔍</button>
      </form>
      <Mappit />
    </div>
  );
}
