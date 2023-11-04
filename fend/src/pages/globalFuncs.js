import jwt_decode from 'jwt-decode';
import { useState } from 'react';

let token;
let dTok;

async function localToken(){
    token = localStorage.getItem("KMMtoken");
    dTok = await jwt_decode(token);
}

localToken();

export function takeToken(callback){
    return callback(null, token, dTok);
}

export function takeBioData(callback){
    let myInfo;
    let infoAvail = false;

    if(infoAvail){
      return callback(null,myInfo);
    }
    else{
      fetch(`http://localhost:4000/post${dTok}`, {
        method: "GET",
        headers: {
          "auth-token": `${token}`,
        },
      })
        .then((responce) => responce.json())
        .then((data) => {
          myInfo = data;
          infoAvail = true;
          return callback(null,data);
          // alert("data recieved");
      });
    }
    
}