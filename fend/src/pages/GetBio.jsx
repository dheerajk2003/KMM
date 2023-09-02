import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function GetBio(){

    const [details, setDetails] = useState({
        fullName: "",
        age: "",
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

    return (
        <form className="bioForm" onSubmit={handleSubmit} encType= "multipart/form-data">
            <input type="text" name="fullName" id="fullName" placeholder="Enter Full Name" required onChange={handleChange}/>
            <input type="number" name="age" id="age" placeholder="Enter Age" required onChange={handleChange}/>
            <input type="text" name="state" id="state" placeholder="Enter State" required onChange={handleChange}/>
            <input type="text" name="city" id="city" placeholder="Enter City" required onChange={handleChange}/>
            <input type="text" name="cast" id="cast" placeholder="Enter Cast / Nukh" required onChange={handleChange}/>
            <input type="text" name="occupation" id="occupation" placeholder="Enter Occupation" required  onChange={handleChange}/>
            <span>
                <label htmlFor="gender">Gender : </label>
                <input type="radio" name="gender" id="male" value="Male" onChange={handleChange}/> 
                <label htmlFor="male">Male</label>
                <input type="radio" name="gender" id="female" value="Female" onChange={handleChange}/> 
                <label htmlFor="female">Female</label>
            </span>
            <label htmlFor="family">Family Type : </label>
            <select name="family" id="family" onChange={handleChange}>
                <option value="nuclear">Nuclear</option>
                <option value="joint">Joint</option>
                <option value="single">Single parent</option>
            </select>
            <label htmlFor="education">Education : </label>
            <select name="education" id="education" onChange={handleChange}>
                <option value="10">10th</option>
                <option value="12">12th</option>
                <option value="under graduate">Under Graduate</option>
                <option value="post graduate">Post Graduate</option>
                <option value="b.tech">B.Tech</option>
                <option value="m.tech">M.Tech</option>
                <option value="mbbs">MBBS</option>
            </select>
            <label htmlFor="about">About you and your Hobbies</label>
            <textarea name="about" id="about" cols="30" rows="5" onChange={handleChange}></textarea>
            <label htmlFor="aboutPar">what kind of partner are you looking for</label>
            <textarea name="aboutPar" id="aboutPar" cols="30" rows="5" onChange={handleChange}></textarea>
            {/* <input type="file" name="image" onChange={handleFileChange} />                 */}
            <button type="submit">Submit</button>
        </form>
    )
}