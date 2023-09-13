require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");

const myql = require("./config");
// const { receiveMessageOnPort } = require("worker_threads");
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
    myql.getBio(userId, (error, responce) => {
      if (error) {
        console.log("error " + error);
        res.json(error);
      }
      if (responce) {
        res.status(200).json(responce);
      } else {
        res.json("bio data does not exist");
      }
    });
  } else {
    res.status(500).json("error in finding Bio Data");
  }
});

// Personal Info (Private Route)

app.get("/info:userId", authenticateToken, (req, res) => {
  const { userId } = req.params;
  if (userId) {
    myql.getBio(userId, (error, responce) => {
      if (error) {
        console.log("error " + error);
        res.json(error);
      }
      if (responce) {
        res.status(200).json(responce);
      } else {
        res.json("bio data does not exist");
      }
    });
  } else {
    res.status(500).json("error in finding Bio Data");
  }
});

// Serving list of people compatible to be partner.

app.post("/partner", authenticateToken, async (req, res) => {
  try {
    const id = req.header("id");
    const { searchInput, searchType } = await req.body;
    if (searchInput) {
      console.log("searchINput rec", searchInput, searchType);
      myql.searchPar(searchType, `%${searchInput}%`, (error, responce) => {
        if (error) {
          console.error("Error: " + error);
          res.status(500).json({ error: "Database error" });
        } else {
          // console.log(responce);
          res.json(responce);
        }
      }
      );
    }
    else if (id) {
      myql.getBio(id, (error, responce) => {
        if (error) {
          console.error("Error: " + error);
          res.status(500).json({ error: "Database error" });
        }
        if (responce) {
          const myGender = responce.gender;

          myql.findPar(myGender, (error, responce) => {
            if (error) {
              console.error("Error: " + error);
              res.status(500).json({ error: "Database error" });
            } else {
              // console.log(responce);
              res.json(responce);
            }
          });
        }
      });
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

    myql.getRegistered(
      email,
      function (error, responce) {
        if (error) {
          console.error("Error: " + error);
          res.status(500).json({ ok: false, error: "Database error" });
        } else {
          if (responce === email) {
            res.json({ ok: false, error: "user already exists" });
          } else {
            const hashPassword = bcrypt.hashSync(password, salt);
            myql.registration({ email, hashPassword });
            res.json({ ok: true, error: "registered succesfully" });
          }
        }
      },
      null
    );
  } catch (error) {
    res.status(500).json(`${error}` + "error in registration");
  }
});

// Login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    myql.login(
      email,
      async (error, responce) => {
        if (error) {
          console.error("Error: " + error);
          res.status(500).json({ ok: false, error: "Database error" });
        } else if (responce) {
          const passOk = await bcrypt.compare(password, responce.hashPassword);
          if (passOk) {
            const token = jwt.sign(
              responce.id,
              process.env.ACCESS_TOKEN_SECRET
            );
            res.json({ ok: true, error: "logged in succesfully", accessToken: token });
          } else {
            res.json("wrong email or password");
          }
        } else {
          res.json({ ok: false, error: "user not registered" });
        }
      },
      null
    );
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
      details.id = id;
      myql.getBio(id, (error, responce) => {
        if (error) {
          console.error("Error: " + error);
          res.status(500).json({ error: "Database error" });
        }
        if (responce) {
          return res.status(500).json("Bio Data already exists");
        } else {
          myql.setBio(details);
        }
      });
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

  try {
    myql.setImgName(uploadedImagePath, id);
    res.json("image uploaded succesfully");
  } catch (error) {
    res.json("error: " + error);
  }
});

// removing image from local storage

function removeImg(id) {
  myql.getBio(id, (error, responce) => {
    if (error) {
      console.error("Error: " + error);
      res.status(500).json({ error: "Database error" });
    } else if (responce) {
      fs.unlink(`./images/${responce.image}`, (error) => {
        if (error) {
          console.log("error while del image " + error);
        }
      });
    }
  });
}

// deteting a users biodata from db

app.get("/deletebio", authenticateToken, (req, res) => {
  try {
    const id = req.header("id");
    if (id) {
      removeImg(id);
      myql.delBio(id);
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

    myql.getBio(id, (error, responce) => {
      if (error) {
        console.error("Error: " + error);
        res.status(500).json({ error: "Database error" });
      }
      if (responce) {
        removeImg(id);
        myql.delBio(id);
        myql.setBio(details);
      } else {
        res.json("biodata does'nt exist");
      }
    });
  } catch (error) {
    res.json("An error occured while editing bio data");
  }
});

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
