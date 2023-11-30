import jwt_decode from 'jwt-decode';
import { useContext, useEffect, useId, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { takeBioData } from './globalFuncs';
import Nav from './Nav';
import RedButton from '../components/buttons/redButton';
import { useNavigate } from 'react-router-dom';
import { bioContext } from '../App';

export default function Menu(){
    const {biodata, setBiodata} = useContext(bioContext);
    const navigate = useNavigate();
    const myToken = localStorage.getItem('KMMtoken');
    const decodedToken = jwt_decode(myToken);
    const [myInfo, setMyInfo] = useState({});
    const [bioAvailable, setBioAvailable] = useState(false);
    const [hiddenMenu, setHiddenMenu] = useState(true);
    const {userId} = useParams();

    useEffect(() => {
        setMyInfo(biodata);
        if(!biodata.id){
            getInfo(decodedToken);
        }
        else{
            setBioAvailable(true);
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
                            "fullname" : data
                        });
                    }
                });
            }
        }
        catch(error){
            alert(error);
        }
    }

    function LogOut(){
        localStorage.removeItem("KMMtoken");
        navigate("/");
    }

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
            setBiodata({});
            setBioAvailable(false);
        }
    }

    // function menuShow(){
    //     setHiddenMenu(false);
    // }


    return(
        <>
            {/* <Link className='z-10 w-10 h-4' to="/">xfor</Link> */}
            {/* <Link className='z-10 w-10 h-4 absolute top-2 right-0' to="/" >X</Link>  */}
            <Nav />
            <div className=" w-screen h-5/6 flex flex-col items-center justify-center gap-5 pt-5 mt-24">
                <div className='flex flex-col items-center gap-5'>
                    <img className="object-cover h-52 w-52 overflow-hidden rounded-full " src={`http://localhost:4000/images/${myInfo.image}`} alt='not found' />
                    <h2 className='text-5xl text-gray-600 font-bold'>{myInfo.fullname}</h2>
                </div>
                <div className='w-auto flex justify-center gap-2 items-center'>
                    {/* <button className='border-2 border-rose-600 text-rose-600 rounded px-2 py-1 m-2' onClick={LogOut}>Log Out</button> */}
                    <RedButton name="Log Out" func={LogOut} />
                    {bioAvailable && <RedButton name={<Link to="/editbio" >Edit Bio</Link>} />}
                    {/* <button className='border-2 border-rose-600 text-rose-600 rounded px-2 py-1 m-2'>{<Link to="/editbio" >Edit Bio</Link>}</button> */}
                    {bioAvailable ? <RedButton name="Delete Biodata" func={deleteBio}  /> : <RedButton name={<Link to="/biodata" >Enter Bio</Link>} /> }
                    {/* <button 
                    className='border-2 border-rose-600 text-rose-600 rounded px-2 py-1 m-2'
                    onClick={() => deleteBio()}
                    style={{
                        display: bioAvailable ? "inline" : "none"
                    }}
                    >Delete Bio</button>
                    <button style={{
                        display: bioAvailable ? "none" : "inline"
                    }}
                    className='border-2 border-rose-600 text-rose-600 rounded px-2 py-1 m-2'
                    >{<Link to="/biodata" >Enter Bio</Link>}</button> */}
                </div>
            </div>
        </>
    );
}