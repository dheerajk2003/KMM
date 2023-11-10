import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, resolvePath, useParams } from 'react-router-dom';
import Nav from './Nav';

export default function UserInfo()
{
    const myToken = localStorage.getItem('KMMtoken');
    const decodedToken = jwt_decode(myToken);
    const [meInfo, setMeInfo] = useState({});
    const [myInfo, setMyInfo] = useState({});
    const {userId} = useParams();
    const [isRequested, setIsRequested] = useState(false);

    useEffect(() => {
        if(userId){
            getInfo(userId);
            getInfo(decodedToken);
        }
        if(userId && decodedToken){
            
            getRequests();
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
                    if(id == decodedToken){
                        setMeInfo(data);
                    }
                    else if(data?.id){
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

    async function postRequest(e){
        e.preventDefault()
        await fetch("http://localhost:4000/setRequest",{
            method: "POST",
            headers: {
                "auth-token": `${myToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({person:userId, requestor:decodedToken, name: meInfo.fullname, reqType: !isRequested})
        })
        .then(responce => responce.json())
        .then((data) => {
            if(data.affectedRows > 0 && data.insertId > 0){
                setIsRequested(true);
            }
            else{
                setIsRequested(false);
            }
        })
    }

    async function getRequests(){
        try{
            const responce = await fetch("http://localhost:4000/getRequests",{
                method: "POST",
                headers:{
                    "auth-token": `${myToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({person:userId, requestor:decodedToken})
            })
            const data = await responce.json();
            if(userId == data[0]?.personId){
                setIsRequested(true);
                const date = new Date();
            }
        }
        catch(error){
            console.log("error in getting requests");
        }
    }

    function MapInfo(){
        const data =  
        <div className='w-screen h-auto flex flex-row'>
            <div className='w-1/3 min-w-max h-full flex flex-col'>
                <div className='w-full max-w-md h-52 overflow-hidden object-cover'>
                    <img 
                        src={`http://localhost:4000/images/${myInfo.image}`} alt={myInfo.image}
                        className="h-full object-cover transition ease-out duration-300 hover:absolute hover:h-96 "
                    />
                </div>
                <div className='py-8 px-1 w-full' >
                    <div className='flex flex-row m-2 text-lg items-center'><p className='w-1/3 text-gray-600'>State - </p> <p className="item ml-2 capitalize ">{myInfo.state}</p></div> 
                    <div className='flex flex-row m-2 text-lg items-center'><p className='w-1/3 text-gray-600'>City - </p> <p className="item ml-2 capitalize ">{myInfo.city}</p></div> 
                    <div className='flex flex-row m-2 text-lg items-center'><p className='w-1/3 text-gray-600'>Occupation - </p> <p className="item ml-2 capitalize">{myInfo.occupation}</p></div> 
                    <div className='flex flex-row m-2 text-lg items-center'><p className='w-1/3 text-gray-600'>Education - </p> <p className="item ml-2 capitalize ">{myInfo.education}</p></div> 
                    {/* <p className="item">{myInfo.gender}</p> */}
                    <div className='flex flex-row m-2 text-lg items-center'><p className='w-1/3 text-gray-600'>Family type - </p> <p className="item ml-2 capitalize">{myInfo.family}</p></div> 
                </div>
            </div>
            <div className='w-1/2 h-2/3 flex-col'>
                <div className='h-44 py-4'>
                    <p className="item text-4xl text-gray-700 font-bold mb-6">{myInfo.fullname}</p>
                    <div className='text-xl'>
                        <span className='flex flex-row items-center gap-3'><p className='text-red-300'>Birth Date - </p><p className="item">{myInfo.dob}</p></span>
                        <span className='flex flex-row items-center gap-3'><p className='text-red-300'>Cast/Nukh - </p><p className="item capitalize">{myInfo.cast}</p></span>
                        <button style={{backgroundColor: isRequested ? "gray" : "red"}} onClick={postRequest}>{isRequested ? "Requested" : "Request Insta"}</button>
                    </div>
                </div>
                <div className='h-auto'>
                    <div className='py-5'>
                        <p className='p-2 text-gray-600 text-lg'>About Me</p>
                        <p className="item">{myInfo.about} Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium qui, itaque dolorum vel, quisquam aut ab ad iste hic saepe amet tempore sit asperiores quam cum omnis autem eveniet expedita dicta id? Vitae eligendi molestiae id cumque cum saepe ipsa corporis, blanditiis magnam earum rerum, aut maiores a provident deserunt?</p>
                    </div>
                    <div className='py-5'>
                        <p className='p-2 text-gray-600 text-lg'>My partner preference</p>
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
        </div>
    )
}