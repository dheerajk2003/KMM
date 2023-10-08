import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export default function EditBio(){

    const token = localStorage.getItem("KMMtoken");
    const decodeToken = jwt_decode(token);
    const [details, setDetails] = useState({
        fullName: "",
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

    useEffect(() => {
        fetch(`http://localhost:4000/info${decodeToken}`, {
                    method: 'GET',
                    headers: {
                        "auth-token": `${token}`
                    }
                })
                .then(responce => responce.json())
                .then((data) => {
                    if(data.id){
                        setDetails(data);
                    }
                    else{
                        alert(data);
                    }
                });
    }, []);

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
        try{
            setDetails((prevData) => {
                return {...prevData , "id": `${decodeToken}`}
            })
            console.log(details, token, decodeToken);
            fetch("http://localhost:4000/editbio", {
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

    return (
        <form className="bioForm" onSubmit={handleSubmit} encType= "multipart/form-data">
            <input type="text" name="fullname" value={details.fullname} id="fullname" placeholder="Enter Full Name" required onChange={handleChange}/>
            <input type="number" name="dob" value={details.dob} id="dob" placeholder="Enter DOB" required onChange={handleChange}/>
            <input type="text" name="state" value={details.state} id="state" placeholder="Enter State" required onChange={handleChange}/>
            <input type="text" name="city" value={details.city} id="city" placeholder="Enter City" required onChange={handleChange}/>
            <input type="text" name="cast" value={details.cast} id="cast" placeholder="Enter Cast / Nukh" required onChange={handleChange}/>
            <input type="text" name="occupation" value={details.occupation} id="occupation" placeholder="Enter Occupation" required  onChange={handleChange}/>
            <span>
                <label htmlFor="gender">Gender : </label>
                <input type="radio" name="gender" id="male" value="Male" onChange={handleChange}/> 
                <label htmlFor="male">Male</label>
                <input type="radio" name="gender" id="female" value="Female" onChange={handleChange}/> 
                <label htmlFor="female">Female</label>
            </span>
            <label htmlFor="family">Family Type : </label>
            <select name="family" id="family" onChange={handleChange} >
                <option value="nuclear" selected={details.family === "nuclear" && true} >Nuclear</option>
                <option value="joint"  selected={details.family === "joint" && true} >Joint</option>
                <option value="single"  selected={details.family === "single" && true} >Single parent</option>
            </select>
            <label htmlFor="education">Education : </label>
            <select name="education" id="education" onChange={handleChange}>
                <option value="10" selected={details.education === "10" && true}>10th</option>
                <option value="12" selected={details.education === "12" && true}>12th</option>
                <option value="under graduate" selected={details.education === "under graduate" && true} >Under Graduate</option>
                <option value="post graduate" selected={details.education === "post graduate" && true} >Post Graduate</option>
                <option value="b.tech" selected={details.education === "b.tech" && true} >B.Tech</option>
                <option value="m.tech" selected={details.education === "m.tech" && true} >M.Tech</option>
                <option value="mbbs" selected={details.education === "mbbs" && true} >MBBS</option>
            </select>
            <label htmlFor="about">About you and your Hobbies</label>
            <textarea name="about" value={details.about} id="about" cols="30" rows="5" onChange={handleChange}></textarea>
            <label htmlFor="aboutPar">what kind of partner are you looking for</label>
            <textarea name="aboutPar" value={details.aboutPar} id="aboutPar" cols="30" rows="5" onChange={handleChange}></textarea>
            <input type="file" name="image" onChange={handleFileChange} />                
            <button type="submit">Submit</button>
        </form>
    )
}