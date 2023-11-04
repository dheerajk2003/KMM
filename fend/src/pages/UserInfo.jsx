import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav';

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
        console.log(id);
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
                        console.log(data);
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
    // setInterval(() => {
    //     console.log(myInfo);
    // }, 4000);

    function LogOut(){
        localStorage.removeItem("KMMtoken");
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
            setBioAvailable(false);
        }
    }

    function MapInfo(){
        const data =  
        <div className='w-screen h-auto flex flex-row'>
            <div className='w-1/3 min-w-max h-full flex flex-col'>
                <div className='w-full h-44'>
                    <img 
                        src={`http://localhost:4000/images/${myInfo.image}`} alt={myInfo.image}
                        className="h-full object-cover"
                    />
                </div>
                <div className='py-8 px-1 w-full' >
                    <div className='flex flex-row m-2 text-xl items-center'><p className='w-1/3 text-gray-800'>State - </p> <p className="item ml-2 capitalize ">{myInfo.state}</p></div> 
                    <div className='flex flex-row m-2 text-xl items-center'><p className='w-1/3 text-gray-800'>City - </p> <p className="item ml-2 capitalize ">{myInfo.city}</p></div> 
                    <div className='flex flex-row m-2 text-xl items-center'><p className='w-1/3 text-gray-800'>Occupation - </p> <p className="item ml-2 capitalize">{myInfo.occupation}</p></div> 
                    <div className='flex flex-row m-2 text-xl items-center'><p className='w-1/3 text-gray-800'>Education - </p> <p className="item ml-2 capitalize ">{myInfo.education}</p></div> 
                    {/* <p className="item">{myInfo.gender}</p> */}
                    <div className='flex flex-row m-2 text-xl items-center'><p className='w-1/3 text-gray-800'>Family type - </p> <p className="item ml-2 capitalize">{myInfo.family}</p></div> 
                </div>
            </div>
            <div className='w-1/2 h-2/3 flex-col'>
                <div className='h-44 py-4'>
                    <p className="item text-4xl text-gray-700 font-bold mb-6">{myInfo.fullname}</p>
                    <div className='text-lg'>
                        <span className='flex flex-row items-center gap-3'><p className='text-gray-600'>Birth Date - </p><p className="item">{myInfo.dob}</p></span>
                        <span className='flex flex-row items-center gap-3'><p className='text-gray-600'>Cast/Nukh - </p><p className="item capitalize">{myInfo.cast}</p></span>
                    </div>
                </div>
                <div className='h-auto'>
                    <div className='py-5'>
                        <p className='p-2 text-gray-600'>About Me</p>
                        <p className="item">{myInfo.about} Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium qui, itaque dolorum vel, quisquam aut ab ad iste hic saepe amet tempore sit asperiores quam cum omnis autem eveniet expedita dicta id? Vitae eligendi molestiae id cumque cum saepe ipsa corporis, blanditiis magnam earum rerum, aut maiores a provident deserunt?</p>
                    </div>
                    <div className='py-5'>
                        <p className='p-2 text-gray-600'>My partner preference</p>
                        <p className="item">{myInfo.aboutPar} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed et suscipit quis sapiente ipsa molestiae, ipsum minus quibusdam sit iste vel officiis tempore saepe nesciunt, maxime doloribus ut asperiores voluptates! A, rem? Aliquid nesciunt pariatur aliquam eaque tempora! Minus ullam dicta quae, nisi voluptatum consequuntur tenetur cupiditate atque in eveniet?</p>
                    </div>
                </div>
            </div>
        </div>
        return data;
    }

    return(
        <div className='userinfo mx-20'>
            <Nav />
            <MapInfo />
            {/* <button>{<Link to="/editbio" >Edit Bio</Link>}</button>
            <button 
            onClick={() => deleteBio()}
            style={{
                display: bioAvailable ? "inline" : "none"
            }}
            >Delete Bio</button>
            <button onClick={LogOut}>Log Out</button>
            <button>{<Link to="/biodata" >Enter Bio</Link>}</button> */}
        </div>
    )
}