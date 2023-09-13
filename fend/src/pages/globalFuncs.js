import jwt_decode from 'jwt-decode';

let token;
let dTok;

async function localToken(){
    token = await localStorage.getItem("KMMtoken");
    dTok = await jwt_decode(token);
}

localToken();

export function takeToken(callback){
    return callback(null, token, dTok);
}

export function takeBioData(callback){
    fetch(`http://localhost:4000/post${dTok}`, {
          method: "GET",
          headers: {
            "auth-token": `${token}`,
          },
        })
          .then((responce) => responce.json())
          .then((data) => {
            return callback(null, data);
            // alert("data recieved");
        });
}