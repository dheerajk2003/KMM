import { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';

export default function Partner(){
    const myToken = localStorage.getItem('KMMtoken');
    const id = jwt_decode(myToken)
    const [partnerList , setPartnerList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/partner" , {
            headers: {
                "auth-token" : `${myToken}`,
                "id" : id
            }
        })
        .then(responce => responce.json())
        .then((data) => {
            setPartnerList(data);
        })
    }, []);

    function Mappit(){
        const list = partnerList.map((l) => {
            return <div>
                <img src={`http://localhost:4000/images/${l.image}`} alt="not available" className="infoImg"/>
                <p>Name : {l.fullName}</p>
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
        <Mappit />
    )
}