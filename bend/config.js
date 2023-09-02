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
            console.log("responce last id" + res.insertId);
        }
    })
}

module.exports.getRegistered = function getRegistered(email, callback) {
    con.query("SELECT * FROM Login WHERE email = ?", email, (error, res) => {
      if (error) {
        console.error("Error: " + error);
        return callback(error, null); // Pass the error to the callback
      }
  
      if (res.length > 0) {
        console.log(res[0]);
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