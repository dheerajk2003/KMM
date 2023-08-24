// import { response } from "express";
import { useState } from "react"

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            fetch('http://localhost:4000/login' ,{
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email, password})
            })
            .then((response) => response.json())
            .then((data) => {
                const accToken = data.accessToken;
                if(accToken){
                    localStorage.setItem('KMMtoken', accToken);
                }
                else{
                    alert(data);
                }
            });
            
        }
        catch(error){
            alert("error occured in login" + error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="" id="" placeholder="enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="" placeholder="enter password" value={password} onChange={(e) => setPassword(e.target.value)} id="" />
            <button type="submit">Login</button>
            <p>{email}</p>
            <p>{password}</p>
        </form>
    )
}