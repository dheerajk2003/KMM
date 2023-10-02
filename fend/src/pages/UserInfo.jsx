import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function UserInfo()
{
    const myToken = localStorage.getItem('KMMtoken');
    const [myInfo, setMyInfo] = useState({});
    const [bioAvailable, setBioAvailable] = useState(false);
    const {userId} = useParams();

    useEffect(() => {
        if(userId){
            getInfo(userId);
        }
        else{
            const decodedToken = jwt_decode(myToken);
            getInfo(decodedToken);
        }
    }, []);

    function getInfo(id){
        try{
            if(id){
                fetch(`http://localhost:4000/info${id}`, {
                    method: 'GET',
                    headers: {
                        "auth-token": `${myToken}`
                    }
                })
                .then(responce => responce.json())
                .then((data) => {
                    if(data.id){
                        setBioAvailable(true);
                        setMyInfo(data);
                    }
                    else{
                        setMyInfo({
                            "fullName" : data
                        });
                    }
                });
            }
        }
        catch(error){
            alert(error);
        }
    }
    // setInterval(() => {
    //     console.log(myInfo);
    // }, 4000);

    function deleteBio(){
        const alertData = confirm("Do you realy want to delete bio data");
        if(alertData){
            fetch("http://localhost:4000/deletebio", {
                method: "GET",
                headers: {
                    "auth-token": `${myToken}`,
                    "id" : jwt_decode(myToken)
                }
            })
            .then(responce => responce.json())
            .then(data => alert(data));
            getInfo();
            setBioAvailable(false);
        }
    }

    function MapInfo(){
        const data =  <div>
                <p className="item">{myInfo.fullname}</p>
                <p className="item">{myInfo.dob}</p>
                <p className="item">{myInfo.state}</p>
                <p className="item">{myInfo.city}</p>
                <p className="item">{myInfo.cast}</p>
                <p className="item">{myInfo.occupation}</p>
                <p className="item">{myInfo.gender}</p>
                <p className="item">{myInfo.family}</p>
                <p className="item">{myInfo.education}</p>
                <p className="item">{myInfo.about}</p>
                <p className="item">{myInfo.aboutPar}</p>
                <img src={`http://localhost:4000/images/${myInfo.image}`} alt={myInfo.image} className='infoImg' />
            </div>
        return data;
    }

    return(
        <div>
            <MapInfo />
            <button>{<Link to="/editbio" >Edit Bio</Link>}</button>
            <button 
            onClick={() => deleteBio()}
            style={{
                display: bioAvailable ? "inline" : "none"
            }}
            >Delete Bio</button>
            {/* <button 
            style={{
                display: bioAvailable ? "none" : "inline"
            }}
            >{<Link to="/biodata" >Enter Bio</Link>}</button> */}
            <button>{<Link to="/biodata" >Enter Bio</Link>}</button>
        </div>
    )
}