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

module.exports.searchPar = function searchPar(type, value, gen, callback){
  console.log( type , value, gen);
  // here ?? represents column name
  con.query('SELECT * FROM Biodata WHERE gender != ? AND ?? LIKE ?', [gen, type, '%' + value + '%'], (error, res) => {
    if (error) {
      console.log("Error: " + error);
      // return callback(error, null); // Pass the error to the callback
    }
    if(res){
      callback(null, res);
    }
  })
}

module.exports.setRequest = function setRequest(pId, rId, name, rt, callback){
  console.log("from db " + pId, rId, name, rt);
  if(rt == true){
    con.query(`insert into Requests(personId, requestorId, acceptedId, requestorName) select ?,?,NULL,? from dual where not exists(select 1 from Requests where personId = ${pId} AND requestorId = ${rId}) limit 1`, [pId, rId, name], (error, res) => {
      if(error){
        callback(error, null);
      }
      if(res){
        callback(null, res);
      }
    })
  }
  else{
    con.query('delete from Requests where personId = ? AND requestorId = ?', [pId, rId], (error, res) => {
      if(error){
        callback(error, null);
      }
      if(res){
        callback(null, res);
      }
    })
  }
}

module.exports.getRequests = function getRequests(pId, rId, callback){
  console.log("from db getRequests" + pId, rId);
  if(pId && rId){
    con.query('select personId from Requests where personId = ? && requestorId = ?', [pId,rId], (error, res) => {
      if(error){
        callback(error, null);
      }
      if(res){
        callback(null, res);
      }
    })
  }
  else if(pId){
    con.query('select requestorId, requestorName from Requests where personId = ?', pId, (error,res) => {
      if(error){
        callback(error, null);
      }
      if(res){
        callback(null, res);
      }
    })
  }
}

module.exports.getName = function getName(id, callback){
  try{
    con.query("select fullname from Biodata where id = ?", id, (error, res) => {
      if(error){
        callback(error, null);
      }
      if(res){
        callback(null, res);
      }
    })
  }
  catch(error){
    console.log("error in getname" + error);
    callback(error, null);
  }
}