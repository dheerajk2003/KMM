import { useState } from "react";
import jwt_decode from "jwt-decode";
import Nav from "./Nav";
import RedButton from "../components/buttons/redButton";
import { useNavigate } from "react-router-dom";

export default function GetBio() {
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        fullname: "",
        dob: "",
        state: "",
        city: "",
        cast: "",
        occupation: "",
        instaId:"",
        gender: "",
        family: "",
        education: "",
        about: "",
        aboutPar: ""
    })
    const [userImage, setUserImage] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setDetails((prevData) => {
            return { ...prevData, [name]: value };
        });
    }

    function handleFileChange(e) {
        setUserImage(e.target.files[0]);
    }

    async function checkAge(e){
        e.preventDefault();
        const date = new Date();
        const cYear = date.getFullYear();

        const dateN = new Date(details.dob);
        const nYear = dateN.getFullYear();
        if(cYear - nYear < 21){
            alert("Age should be atleast 21 Years old");
        }
        else{
            handleSubmit();
        }
    }

    async function handleSubmit() {
        let decodeToken;
        try {
            const token = localStorage.getItem("KMMtoken");
            decodeToken = jwt_decode(token);
            setDetails((prevData) => {
                return { ...prevData, "id": `${decodeToken}` }
            })

            await fetch(`${import.meta.env.VITE_BAD}/getBio`, {
                method: 'POST',
                headers: {
                    "id": decodeToken,
                    "auth-token": token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            }).then(responce => responce.json())
                .then(data => alert(data));
        }
        catch (e) {
            console.log(e);
        }
        try {
            if (userImage) {
                const formData = new FormData();
                formData.append('image', userImage);
                await fetch(`${import.meta.env.VITE_BAD}/uploadimage`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "id": decodeToken
                    }
                })
                    .then(responce => responce)
                    .then((data) => {
                        window.Location.reload(false);
                    })
            }
            
        }
        catch (e) {
            console.log("an error occured - " + e);
        }
    }
    10
    return (
        <div className="flex flex-col items-center justify-center">
            <Nav />
            <div className="w-screen px-40 flex flex-col items-center justify-center">
                <h3 className="text-center text-3xl font-bold text-gray-700 mb-6">Enter your Biodata</h3>
                <form className="bioForm text-sm w-1/2 flex flex-col items-center justify-center" onSubmit={checkAge} encType="multipart/form-data">
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="fullname">Name</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="text" name="fullname" id="fullname" placeholder="Enter Full Name" required="true" onChange={handleChange} />
                    </div>


                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="state">State</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="text" name="state" id="state" placeholder="Enter your State Name" required={true} onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="city">City</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="text" name="city" id="city" placeholder="Enter your City Name" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="cast">Cast</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="text" name="cast" id="cast" placeholder="Enter your Cast or Nukh" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="occupation">Occupation</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="text" name="occupation" id="occupation" placeholder="Enter your Occupation" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="instaId">Instagram</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="text" name="instaId" id="instaId" placeholder="Enter Account Link (optional)" onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="dob">DOB</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" type="date" name="dob" id="dob" placeholder="Enter Date of Birth" required onChange={handleChange} />
                    </div>

                    <span className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="gender">Gender</label>
                        <span className="w-full px-3 h-1/2 bg-stone-200 rounded-md">
                            <input type="radio" name="gender" id="male" value="Male" required onChange={handleChange} />
                            <label htmlFor="male">Male</label>
                            <input className="ml-3" type="radio" name="gender" id="female" value="Female" onChange={handleChange} />
                            <label htmlFor="female">Female</label>
                        </span>
                    </span>
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="family">Family Type</label>
                        <select className="w-full px-3 h-1/2 bg-stone-200 rounded-md" name="family" id="family" required onChange={handleChange}>
                            <option value="nuclear">Nuclear</option>
                            <option value="joint">Joint</option>
                            <option value="alone">Alone</option>
                        </select>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="education">Education</label>
                        <select className="w-full px-3 h-1/2 bg-stone-200 rounded-md" name="education" id="education" required onChange={handleChange}>
                            <option value="10">10th</option>
                            <option value="12">12th</option>
                            <option value="under graduate">Under Graduate</option>
                            <option value="post graduate">Post Graduate</option>
                            <option value="b.tech">B.Tech</option>
                            <option value="m.tech">M.Tech</option>
                            <option value="mbbs">MBBS</option>
                        </select>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center">
                        <label className="text-gray-600" htmlFor="about">About you</label>
                        <textarea className="w-full px-3 h-full bg-stone-200 rounded-md" name="about" id="about" rows="3" placeholder="Enter your hobbies, interests, likings, etc" required onChange={handleChange}></textarea>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center ">
                        <label className="text-gray-600" htmlFor="aboutPar">Partner Preference</label>
                        <textarea className="w-full px-3 h-full bg-stone-200 rounded-md" name="aboutPar" id="aboutPar" rows="3" placeholder="Enter what kind of partner you want" required onChange={handleChange}></textarea>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20">
                        {/* <div > */}

                        {/* <p className="text-gray-600">(Do not upload filtered or snapchat pics)</p> */}
                        {/* </div> */}
                        <label className="text-gray-600" htmlFor="image">Fullbody Image</label>
                        <input className="w-full pt-2 px-3 h-full bg-stone-200 rounded-md" type="file" name="image" required onChange={handleFileChange} />
                    </div>
                    <div className="w-full my-1 mb-5 flex flex-col items-center justify-center h-20">
                        <button className="w-full h-8 text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-4 py-1 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:bg-rose-800">Submit
                        </button>
                        {/* <RedButton name={"Submit"} func={handleSubmit} /> */}
                    </div>
                </form>
            </div>
        </div>
    )
}