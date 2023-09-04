import { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';

export default function Partner(){
    const myToken = localStorage.getItem('KMMtoken');
    const id = jwt_decode(myToken)
    const [partnerList , setPartnerList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchType, setSearchType] = useState("fullname");

    useEffect(() => {
        fetch("http://localhost:4000/partner" , {
            headers: {
                "auth-token" : `${myToken}`,
                "id" : id
            },
            method:"POST",
            body : JSON.stringify({})
        })
        .then(responce => responce.json())
        .then((data) => {
            setPartnerList(data);
        })
    }, []);

    function searchDb(e){
        e.preventDefault();
        fetch("http://localhost:4000/partner" , {
            headers: {
                "auth-token" : `${myToken}`,
                "id" : id,
                "Content-Type":"application/json"
            },
            method:"POST",
            body : JSON.stringify({searchInput, searchType})
        })
        .then(responce => responce.json())
        .then((data) => {
            setPartnerList(data);
        })
    }

    function SearchIt(){
        return <form>
            <input type="text" placeholder={`search ${searchType}`} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <select defaultChecked="fullname" onChange={(e) => setSearchType(e.target.value)}>
                <option value="">None</option>
                <option value="fullname">Name</option>
                <option value="city">City</option>
                <option value="cast">Caste</option>
                <option value="occupation">Occupation</option>
            </select>
            <button onClick={searchDb} >Search</button>
        </form>
    }

    function Mappit(){
        const list = partnerList.map((l) => {
            return <div>
                <img src={`http://localhost:4000/images/${l.image}`} alt="not available" className="infoImg"/>
                <p>Name : {l.fullname}</p>
                <p>Age : {l.age}</p>
                <p>State : {l.state}</p>
                <p>City : {l.city}</p>
                <p>Cast : {l.cast}</p>
                <p>Occupation : {l.occupation}</p>
                <p>Gender : {l.gender}</p>
                <p>Family-type : {l.family}</p>
                <p>Education : {l.education}</p>
                <p>About : {l.about}</p>
                <p>Partner-preference : {l.aboutPar}</p>
            </div>
        })
        return list;
    }

    return (
        <>
            {SearchIt()}
            <Mappit />
        </>
    )
}