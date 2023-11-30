import { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Nav from "./Nav";
import { bioContext } from "../App";

export default function EditBio() {
    const { biodata, setBiodata } = useContext(bioContext);
    const token = localStorage.getItem("KMMtoken");
    const decodeToken = jwt_decode(token);
    const [details, setDetails] = useState({
        // fullname: "",
        // dob: "",
        // state: "",
        // city: "",
        // cast: "",
        // occupation: "",
        // gender: "",
        // family: "",
        // education: "",
        // about: "",
        // aboutPar: ""
    })
    const [userImage, setUserImage] = useState(null);


    useEffect(() => {
        setDetails(biodata);

        setTimeout(() => {
            if (biodata.id != decodeToken) {
                fetch(`http://localhost:4000/info${decodeToken}`, {
                    method: 'GET',
                    headers: {
                        "auth-token": `${token}`
                    }
                })
                    .then(responce => responce.json())
                    .then((data) => {
                        if (data.id) {
                            setBiodata(data);
                            setDetails(data);
                        }
                        else {
                            alert(data);
                        }
                    });
            }
        }, 1000);


        // fetch(`http://localhost:4000/info${decodeToken}`, {
        //     method: 'GET',
        //     headers: {
        //         "auth-token": `${token}`
        //     }
        // })
        //     .then(responce => responce.json())
        //     .then((data) => {
        //         if (data.id) {
        //             setDetails(data);
        //             console.log(details);
        //         }
        //         else {
        //             alert(data);
        //         }
        //     });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setDetails((prevData) => {
            return { ...prevData, [name]: value };
        });
    }

    function handleFileChange(e) {
        setUserImage(e.target.files[0]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        try {
            setDetails((prevData) => {
                return { ...prevData, "id": `${decodeToken}` }
            })
            
            fetch(`${import.meta.env.VITE_BAD}/editbio`, {
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
                fetch("http://localhost:4000/uploadimage", {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "id": decodeToken
                    }
                    // })
                    //     .then(responce => responce.json())
                    //     .then((data) => {
                    //         console.log(data);
                })
            }
        }
        catch (e) {
            alert("an error occured - " + e);
        }
    }

    return (
        // <form className="bioForm" onSubmit={handleSubmit} encType= "multipart/form-data">
        //     <input type="text" name="fullname" value={details.fullname} id="fullname" placeholder="Enter Full Name" required onChange={handleChange}/>
        //     <input type="number" name="dob" value={details.dob} id="dob" placeholder="Enter DOB" required onChange={handleChange}/>
        //     <input type="text" name="state" value={details.state} id="state" placeholder="Enter State" required onChange={handleChange}/>
        //     <input type="text" name="city" value={details.city} id="city" placeholder="Enter City" required onChange={handleChange}/>
        //     <input type="text" name="cast" value={details.cast} id="cast" placeholder="Enter Cast / Nukh" required onChange={handleChange}/>
        //     <input type="text" name="occupation" value={details.occupation} id="occupation" placeholder="Enter Occupation" required  onChange={handleChange}/>
        //     <span>
        //         <label htmlFor="gender">Gender : </label>
        //         <input type="radio" name="gender" id="male" value="Male" onChange={handleChange}/> 
        //         <label htmlFor="male">Male</label>
        //         <input type="radio" name="gender" id="female" value="Female" onChange={handleChange}/> 
        //         <label htmlFor="female">Female</label>
        //     </span>
        //     <label htmlFor="family">Family Type : </label>
        //     <select name="family" id="family" onChange={handleChange} >
        //         <option value="nuclear" selected={details.family === "nuclear" && true} >Nuclear</option>
        //         <option value="joint"  selected={details.family === "joint" && true} >Joint</option>
        //         <option value="single"  selected={details.family === "single" && true} >Single parent</option>
        //     </select>
        //     <label htmlFor="education">Education : </label>
        //     <select name="education" id="education" onChange={handleChange}>
        //         <option value="10" selected={details.education === "10" && true}>10th</option>
        //         <option value="12" selected={details.education === "12" && true}>12th</option>
        //         <option value="under graduate" selected={details.education === "under graduate" && true} >Under Graduate</option>
        //         <option value="post graduate" selected={details.education === "post graduate" && true} >Post Graduate</option>
        //         <option value="b.tech" selected={details.education === "b.tech" && true} >B.Tech</option>
        //         <option value="m.tech" selected={details.education === "m.tech" && true} >M.Tech</option>
        //         <option value="mbbs" selected={details.education === "mbbs" && true} >MBBS</option>
        //     </select>
        //     <label htmlFor="about">About you and your Hobbies</label>
        //     <textarea name="about" value={details.about} id="about" cols="30" rows="5" onChange={handleChange}></textarea>
        //     <label htmlFor="aboutPar">what kind of partner are you looking for</label>
        //     <textarea name="aboutPar" value={details.aboutPar} id="aboutPar" cols="30" rows="5" onChange={handleChange}></textarea>
        //     <input type="file" name="image" onChange={handleFileChange} />                
        //     <button type="submit">Submit</button>
        // </form>

        <div className="flex flex-col items-center justify-center">
            <Nav />
            <div className="w-screen px-40 flex flex-col items-center justify-center">
                <h3 className="text-center text-3xl font-bold text-gray-700 mb-6">Enter your Biodata</h3>
                <form className="bioForm text-sm w-80 mx-6 flex flex-col items-center justify-center" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="fullname">Name</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" value={details.fullname} type="text" name="fullname" id="fullname" placeholder="Enter Full Name" required onChange={handleChange} />
                    </div>


                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="state">State</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" value={details.state} type="text" name="state" id="state" placeholder="Enter your State Name" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="city">City</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" value={details.city} type="text" name="city" id="city" placeholder="Enter your City Name" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="cast">Cast</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" value={details.cast} type="text" name="cast" id="cast" placeholder="Enter your Cast or Nukh" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="occupation">Occupation</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" value={details.occupation} type="text" name="occupation" id="occupation" placeholder="Enter your Occupation" required onChange={handleChange} />
                    </div>

                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="dob">DOB</label>
                        <input className="w-full px-3 h-1/2 bg-stone-200 rounded-md" value={details.dob} type="date" name="dob" id="dob" placeholder="Enter Date of Birth" required onChange={handleChange} />
                    </div>

                    <span className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="gender">Gender</label>
                        <span className="w-full px-3 h-1/2 bg-stone-200 rounded-md">
                            <input type="radio" name="gender" id="male" value="Male" onChange={handleChange} />
                            <label htmlFor="male">Male</label>
                            <input className="ml-3" type="radio" name="gender" id="female" value="Female" onChange={handleChange} />
                            <label htmlFor="female">Female</label>
                        </span>
                    </span>
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="family">Family Type</label>
                        <select className="w-full px-3 h-1/2 bg-stone-200 rounded-md" name="family" id="family" required onChange={handleChange}>
                            <option value="nuclear" selected={details.family === "nuclear" && true}>Nuclear</option>
                            <option value="joint" selected={details.family === "joint" && true}>Joint</option>
                            <option value="alone" selected={details.family === "alone" && true}>Alone</option>
                        </select>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20 ">
                        <label className="text-gray-600" htmlFor="education">Education</label>
                        <select className="w-full px-3 h-1/2 bg-stone-200 rounded-md" name="education" id="education" required onChange={handleChange}>
                            <option value="10" selected={details.education === "10" && true}>10th</option>
                            <option value="12" selected={details.education === "12" && true}>12th</option>
                            <option value="under graduate" selected={details.education === "under graduate" && true} >Under Graduate</option>
                            <option value="post graduate" selected={details.education === "post graduate" && true} >Post Graduate</option>
                            <option value="b.tech" selected={details.education === "b.tech" && true} >B.Tech</option>
                            <option value="m.tech" selected={details.education === "m.tech" && true} >M.Tech</option>
                            <option value="mbbs" selected={details.education === "mbbs" && true} >MBBS</option>
                        </select>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center">
                        <label className="text-gray-600" htmlFor="about">About you</label>
                        <textarea className="w-full px-3 h-full bg-stone-200 rounded-md" value={details.about} name="about" id="about" rows="3" placeholder="Enter your hobbies, interests, likings, etc" required onChange={handleChange}></textarea>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center ">
                        <label className="text-gray-600" htmlFor="aboutPar">Partner Preference</label>
                        <textarea className="w-full px-3 h-full bg-stone-200 rounded-md" value={details.aboutPar} name="aboutPar" id="aboutPar" rows="3" placeholder="Enter what kind of partner you want" required onChange={handleChange}></textarea>
                    </div>
                    <div className="w-full my-1 flex flex-col items-start justify-center h-20">
                        {/* <div > */}

                        {/* <p className="text-gray-600">(Do not upload filtered or snapchat pics)</p> */}
                        {/* </div> */}
                        <label className="text-gray-600" htmlFor="image">Fullbody Image</label>
                        <input className="w-full pt-2 px-3 h-full bg-stone-200 rounded-md" type="file" name="image" onChange={handleFileChange} />
                    </div>
                    <div className="w-full my-1 mb-5 flex flex-col items-center justify-center h-20">
                        <button className="w-full h-8 text-white bg-rose-600 hover:shadow-lg hover:shadow-rose-400 active:scale-105 focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-4 py-1 text-center "
                        >Submit
                        </button>
                        {/* <RedButton name={"Submit"} func={handleSubmit} /> */}
                    </div>
                </form>
            </div>
        </div>
    )
}