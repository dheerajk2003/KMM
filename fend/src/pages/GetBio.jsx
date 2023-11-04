import { useState } from "react";
import jwt_decode from "jwt-decode";
import Nav from "./Nav";

export default function GetBio(){

    const [details, setDetails] = useState({
        fullname: "",
        dob: "",
        state: "",
        city: "",
        cast: "",
        occupation: "",
        gender: "",
        family: "",
        education: "",
        about: "",
        aboutPar: ""
    })
    const [userImage , setUserImage] = useState(null);

    function handleChange(e){
         const {name, value} = e.target; 
         setDetails((prevData) => {
            return {...prevData , [name] : value};
         });
    }

    function handleFileChange(e){
        setUserImage(e.target.files[0]);
    }

    function handleSubmit(e){
        e.preventDefault();
        let decodeToken;
        try{
            const token = localStorage.getItem("KMMtoken");
            decodeToken = jwt_decode(token);
            setDetails((prevData) => {
                return {...prevData , "id": `${decodeToken}`}
            })
            console.log(details, token, decodeToken);
            fetch("http://localhost:4000/getBio", {
                method: 'POST',
                headers:{
                    "id": decodeToken,
                    "auth-token": token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            }).then(responce => responce.json())
            .then(data => alert(data));
        }
        catch(e){
            console.log(e);
        }
        try{
            if(userImage){
                const formData = new FormData();
                formData.append('image', userImage);
                fetch("http://localhost:4000/uploadimage" , {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "id": decodeToken
                    }
                })
                .then(responce => responce.json())
                .then((data) => {
                    console.log(data);
                })
            }
        }
        catch(e){
            alert("an error occured - " + e);
        }
    }
10
    return (
        <div className="flex flex-col items-center justify-center">
            <Nav />
            <div className="w-screen px-40"> 
                <h3 className="text-center text-3xl font-bold text-gray-700 mb-6">Enter your Biodata</h3>
                <form className="bioForm text-xl" onSubmit={handleSubmit} encType= "multipart/form-data">
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="fullname">Enter Full Name</label>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="text" name="fullname" id="fullname"  required onChange={handleChange}/>
                    </div> 
                        
                        
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="state">Enter State</label>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="text" name="state" id="state" placeholder="" required onChange={handleChange}/>
                    </div> 
                        
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="city">Enter City</label>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="text" name="city" id="city" placeholder="" required onChange={handleChange}/>
                    </div> 
                        
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="cast">Enter Cast / Nukh</label>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="text" name="cast" id="cast" placeholder="" required onChange={handleChange}/>
                    </div> 
                        
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="occupation">Occupation</label>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="text" name="occupation" id="occupation" placeholder="" required  onChange={handleChange}/>
                    </div> 

                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="dob">Enter DOB</label>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="date" name="dob" id="dob" placeholder="" required onChange={handleChange}/>
                    </div> 
                        
                    <span className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="gender">Gender : </label>
                        <span className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md">
                            <input type="radio" name="gender" id="male" value="Male" onChange={handleChange}/> 
                            <label htmlFor="male">Male</label>
                            <input className="ml-3" type="radio" name="gender" id="female" value="Female" onChange={handleChange}/> 
                            <label htmlFor="female">Female</label>
                        </span>
                    </span>
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="family">Family Type : </label>
                        <select className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" name="family" id="family" required onChange={handleChange}>
                            <option value="nuclear">Nuclear</option>
                            <option value="joint">Joint</option>
                            <option value="alone">Alone</option>
                        </select>
                    </div>
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="education">Education : </label>
                        <select className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" name="education" id="education" required onChange={handleChange}>
                            <option value="10">10th</option>
                            <option value="12">12th</option>
                            <option value="under graduate">Under Graduate</option>
                            <option value="post graduate">Post Graduate</option>
                            <option value="b.tech">B.Tech</option>
                            <option value="m.tech">M.Tech</option>
                            <option value="mbbs">MBBS</option>
                        </select>
                    </div>
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="about">About you</label>
                        <textarea className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" name="about" id="about" rows="1" required onChange={handleChange}></textarea>
                    </div>
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <label className="text-gray-600" htmlFor="aboutPar">Partner Preference</label>
                        <textarea className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" name="aboutPar" id="aboutPar" rows="1" required onChange={handleChange}></textarea>
                    </div>
                    <div className="flex flex-row items-center justify-end h-10 pr-1/3">
                        <div >
                            <label className="text-gray-600" htmlFor="image">Upload your Full Image</label>
                            <p className="text-gray-600">(Do not upload filtered or snapchat pics)</p>
                        </div>
                        <input className="w-2/3 ml-5 mr-28 border border-gray-400 rounded-md" type="file" name="image" required onChange={handleFileChange} />                
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}