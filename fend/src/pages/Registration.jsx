import { useState } from "react";

export default function Registration(){
    // const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        await fetch("http://localhost:4000/register", {
            method:'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ email, password})
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data); // Response from the server
        })
        .catch((err) => {
            console.log(err + "error");
        })
    }

    return(
        <form action="" onSubmit={handleSubmit}>
            {/* <input type="text" name="" id="userName" placeholder="enter name" value={username} onChange={(e) => setUsername(e.target.value)}/> */}
            <input type="email" name="" id="userEmail" placeholder="enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="" id="userPassword" placeholder="enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>      
            <button type="submit">Register</button>
        </form>
    );
}