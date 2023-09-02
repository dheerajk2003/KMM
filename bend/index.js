require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const myql = require("./config");
myql.connection();

const app = express();

app.use(express.json());
app.use(cors());

try {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
} catch (e) {
  console.log(e);
  app.use(bodyParser);
  app.use(bodyParser.urlencoded({ extended: true }));
}


// Global data

const salt = bcrypt.genSaltSync(10);

// Multer configeration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });


// Home Page

app.get("/", (req, res) => {
  res.send("hello");
});


// Private route

app.get("/post:userId", authenticateToken, (req, res) => {
  const { userId } = req.params;
  if (userId) {
    const Users = JSON.parse(fs.readFileSync("Users.json", "utf8"));
    const user = Users.find((u) => u.id === parseInt(userId));
    if (user) {
      res.status(200).json(user);
    }
  } else {
    res.status.json("user does not exist");
  }
});


// Personal Info (Private Route)

app.get("/info:userId", authenticateToken, (req, res) => {
  const { userId } = req.params;
  if (userId) {
    const BioData = JSON.parse(fs.readFileSync("BioData.json", "utf8"));
    if (BioData) {
      const userBio = BioData.find((u) => u.id == userId);
      if (userBio) {
        res.status(200).json(userBio);
      } else {
        res.status(400).json("error in finding Bio Data");
      }
    } else {
      res.status(300).json("error in finding data");
    }
  } else {
    res.status(500).json("error in finding Bio Data");
  }
});


// Serving list of people compatible to be partner.

app.get("/partner", authenticateToken, (req, res) => {
  try {
    const id = req.header("id");
    if (id) {
      const BioData = JSON.parse(fs.readFileSync("BioData.json", "utf8"));
      const myData = BioData.find((u) => id === u.id);
      if (myData) {
        const myGender = myData.gender;
        const pList = BioData.filter((p) => p.gender != myGender);
        if (pList) {
          res.json(pList);
        } else {
          res.json("error finding data");
        }
      } else {
        res.json("please insert Bio data");
      }
    } else {
      res.json("please login");
    }
  } catch (error) {
    res.json("error in finding data " + error);
  }
});


// Serving Image

app.get("/images/:imageUrl", (req, res) => {
  try {
    const imageUrl = req.params.imageUrl;
    fs.readFile(`./images/${imageUrl}`, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("error file not found");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/jpeg");
      res.end(data);
    });
  } catch (error) {
    console.log(error);
    res.end(error);
  }
});


//Registration Page

app.post("/register", async (req, res) => {
  try {
    const { email, password } = await req.body;
    
    myql.getRegistered(email, function (error, response) {
      if (error) {
        console.error("Error: " + error);
        res.status(500).json({ error: "Database error" });
      } else {
        if (response === email) {
          res.json("User already exists");
        } else {
          console.log(email + ":" + response);
          const hashPassword = bcrypt.hashSync(password, salt);
          myql.registration({ email, hashPassword });
          res.json("registered succesfully");
        }
      }
    });
  } 
  catch (error) {
    res.status(500).json(`${error}` + "error in registration");
  }
});


// Login

app.post("/login", async (req, res) => {
  let users = [];
  try {
    const { email, password } = req.body;
    const usersData = fs.readFileSync("Users.json", "utf8");
    users = JSON.parse(usersData);
    const existingUser = users.find((user) => email === user.email);

    if (existingUser) {
      const passOk = await bcrypt.compare(password, existingUser.hashPassword);
      if (passOk) {
        const token = jwt.sign(
          existingUser.id,
          process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken: token });
      } else {
        res.json("password not matched");
      }
    } else {
      res.json("User not registered");
    }
  } catch (err) {
    res.json(`${err} error in login`);
  }
});


// Uploading Bio data from form

app.post("/getBio", (req, res) => {
  const id = req.header("id");
  const details = req.body;

  if (id) {
    try {
      let bioData = [];

      // Read existing JSON data, if the file exists

      if (fs.existsSync("BioData.json")) {
        const data = fs.readFileSync("BioData.json", "utf8");
        if (data) {
          bioData = JSON.parse(data);
        }
      }

      // Check if userBio already exists
      const userBio = bioData.find((u) => id === u.id);
      if (userBio) {
        return res.status(500).json("Bio Data already exists");
      }

      details.id = id;

      // Add new bio data and write to file
      bioData.push(details);
      fs.writeFileSync("BioData.json", JSON.stringify(bioData));

      return res.status(200).json("Bio data upload successful");
    } catch (error) {
      console.error(error);
      return res.status(500).json("An error occurred : " + err);
    }
  }
});


// Uploading Image on db

app.post("/uploadimage", upload.single("image"), (req, res) => {
  const uploadedImagePath = req.file.filename;
  const id = req.header("id");
  console.log(uploadedImagePath);

  try {
    const bioData = JSON.parse(fs.readFileSync("BioData.json", "utf8"));
    const userBio = bioData.find((u) => id === u.id);
    if (userBio) {
      userBio.image = uploadedImagePath;
      bioData.map((user) => {
        if (id === user.id) {
          return userBio;
        }
      });
      fs.writeFileSync("BioData.json", JSON.stringify(bioData));
    } else {
      res.json("problem in finding userBio");
    }
    res.json("image uploaded succesfully");
  } catch (error) {
    res.json("error: " + error);
  }
});

// deteting a users biodata from db

app.get("/deletebio", authenticateToken, (req, res) => {
  try {
    const id = req.header("id");
    if (id) {
      const BioData = JSON.parse(fs.readFileSync("BioData.json", "utf8"));
      if (BioData) {
        // console.log(id + 1);
        const data = BioData.filter((b) => {
          console.log(b.id);
          return id != b.id;
        });
        console.log(data);
        fs.writeFileSync("BioData.json", JSON.stringify(data));
        res.json("bio-data deleted succesfully");
      }
    }
  } catch (error) {
    res.json("error occured while deleting biodata" + error);
  }
});

// Updating bio data
app.post("/editbio", authenticateToken, (req, res) => {
  try {
    const id = req.header("id");
    const details = req.body;

    if (id) {
      try {
        let bioData = [];

        // Read existing JSON data, if the file exists

        if (fs.existsSync("BioData.json")) {
          const data = fs.readFileSync("BioData.json", "utf8");
          if (data) {
            bioData = JSON.parse(data);
          }
        }

        // deleting old biodata
        const bio = bioData.filter((b) => {
          console.log(b.id);
          return id != b.id;
        });

        details.id = id;

        // Add new bio data and write to file
        bio.push(details);
        fs.writeFileSync("BioData.json", JSON.stringify(bio));

        return res.status(200).json("Bio data edited successful");
      } catch (error) {
        console.error(error);
        return res.status(500).json("An error occurred : " + err);
      }
    }
  }
  catch (error) {
    res.json("An error occured while editing bio data");
  }
})


// Authentication user token with db token

function authenticateToken(req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(403).json("No token provided");
  }

  const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.user = verified.user;
  next();
}

const port = 4000;
app.listen(port);