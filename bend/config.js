const { response } = require('express');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "KMM"
});

module.exports.connection = function connection(){
    con.connect((error) => {
        if(error){
            console.log("an error occured" + error);
        }
    })
}

module.exports.registration = function registration(loginDetails){
    con.query("INSERT INTO Login SET ?", loginDetails, (error, res) => {
        if(error){
            console.log("an error occured : " + error);
        }
        else{
            // console.log("responce last id" + res.insertId);
        }
    })
}

module.exports.setBio = function setBio(bioData){
  con.query("INSERT INTO Biodata SET ?", bioData, (error, res) => {
    if(error){
      console.log("an error occured : " + error);
    }
    else{
      // console.log("responce last id" + res.insertId);
    }
  });
}

module.exports.getRegistered = function getRegistered(email, callback) {
    con.query("SELECT * FROM Login WHERE email = ?", email, (error, res) => {
      if (error) {
        console.error("Error: " + error);
        return callback(error, null); // Pass the error to the callback
      }
  
      if (res.length > 0) {
        // console.log(res[0]);
        callback(null, res[0].email); // Pass the email to the callback if it exists
      } else {
        callback(null, null); // Pass null if the email doesn't exist
      }
    });
};

module.exports.login = function login(email, callback, id) {
  con.query(`SELECT * FROM Login WHERE ${email ? "email" : "id"} = ?`, email ? email : id, (error, res) => {
    if (error) {
      console.log("Error: " + error);
      return callback(error, null); // Pass the error to the callback
    }
    if(res){
      callback(null, res[0]);
      // console.log("in db: " + res);
    }
  })
}

module.exports.getBio = function getBio(id, callback){
  con.query(`SELECT * FROM Biodata WHERE id = ?`, id , (error , res) => {
    if (error) {
      console.log("Error: " + error);
      return callback(error, null); // Pass the error to the callback
    }
    if(res){
      // console.log(res[0]);
      callback(null, res[0]);
    }
  });
};

module.exports.setImgName = function setImgName(img,id){
  console.log("entered in setImgName");
  con.query("UPDATE Biodata SET image = ? where id = ?" , [img, id], (error, res) => {
    if(error){
      console.log("an error occured in img : " + error);
    }
    else if(res){
      // console.log("responce last id in image" + res);
    }
    else{
      console.log("res doesnt exist");
    }
  });
}

module.exports.delBio = function delBio(id){
  con.query("Delete from Biodata where id = ?" , id, (error, res) => {
    if(error){
      console.log("an error occured in deleting : " + error);
    }
    else if(res){
      // console.log("responce last id" + res);
    }
    else{
      console.log("res doesnt exist");
    }
  })
}

module.exports.findPar = function findPar(gender, callback){
  con.query("SELECT * FROM Biodata WHERE gender != ?", gender, (error, res) => {
    if (error) {
      console.log("Error: " + error);
      // return callback(error, null); // Pass the error to the callback
    }
    if(res){
      callback(null, res);
    }
  })
}

module.exports.searchPar = function searchPar(type, value, callback){
  con.query(`SELECT * FROM Biodata WHERE ${type} LIKE ?`, value, (error, res) => {
    if (error) {
      console.log("Error: " + error);
      // return callback(error, null); // Pass the error to the callback
    }
    if(res){
      callback(null, res);
    }
  })
}