require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");

const myql = require("./config");
const { resolve } = require("path");
const { pid } = require("process");
const { isTypedArray } = require("util/types");
const { createTransport } = require("nodemailer");
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

async function sendMail(recEmail, pin) {
  await transponder.sendMail({
    from: "dheerajkhatri",
    to: recEmail,
    subject: "KMM verificaiton",
    html: "<h3>Verification Code</h3><p>" + pin + "</p>"
  })
}

const upload = multer({ storage: storage });

const transponder = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dheerajkhatri2003@gmail.com",
    pass: "nydt dnau twvf vgkk"
  }
});

// Home Page
// app.use(express.static('fend/dist'));
app.use(express.static(path.join(__dirname, '../', 'fend', 'dist')));

app.get('*.js', (req, res, next) => {
  res.type('text/javascript');
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'fend', 'dist', 'index.html'));
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
    let { searchInput, searchType, gen } = await req.body;
    if (searchInput) {
      //console.log("searchINput rec", searchInput, searchType, gen);
      if (searchType == '') {
        searchType = "fullname";
      }
      myql.searchPar(searchType, `%${searchInput}%`, gen, (error, responce) => {
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
            // console.log(hashPassword);
            const vCode = Math.floor(Math.random() * 10000);
            const active = 0;
            myql.registration({ email, hashPassword, vCode, active });
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

app.post("/login",cors(), async (req, res) => {
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
            if (responce.active.readUInt8(0) === 1) {
              res.json({ ok: true, error: "logged in succesfully", accessToken: token, verified: true });
            }
            else {
              sendMail(responce.email, responce.vCode);
              res.json({ ok: true, error: "please verify email first, verification is send to your email", verified: false });
            }

          } else {
            res.json({ ok: false, error: "email or password is wrong" });
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

app.post("/verify", (req, res) => {
  try {
    const { email, vCode } = req.body;
    myql.getVerify(email, vCode, (error, responce) => {
      if (responce) {
        if (responce.length > 0) {
          myql.setVerfify(email, vCode, (err, responce2) => {
            if (responce2) {
              if (responce2.affectedRows > 0) {
                const token = jwt.sign(
                  responce[0].id,
                  process.env.ACCESS_TOKEN_SECRET
                );
                res.json({ ok: true, error: "logged in succesfully", accessToken: token, verified: true });
              }
            }
            if (err) {
              console.log(err);
              res.json({ ok: false, error: "error while verifying" });
            }
          })
        }
        else {
          res.json({ ok: false, error: "wrong code" });
        }
      }
      if (error) {
        console.log(error);
        res.json({ error: "error while verifying" })
      }
    })
  }
  catch (error) {
    console.log(error);
  }
})

// Uploading Bio data from form

app.post("/getBio", (req, res) => {
  const id = req.header("id");
  const details = req.body;

  if (id) {
    try {
      details.id = id;
      myql.getBio(id, (error, responce) => {

        if (responce) {
          res.status(500).json("Bio Data already exists");
        }
        else if (error) {
          console.error("Error: " + error);
          res.status(500).json({ error: "Database error" });
        }
        else {
          myql.setBio(details);
          return res.status(200).json("Bio data upload successful");
        }
      });

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
    res.json(res);
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
      fs.unlink(`images/${responce.image}`, (error) => {
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
        if (details.image != responce.image) {
          removeImg(id);
        }
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

app.post("/setRequest", authenticateToken, (req, res) => {
  try {
    const { person, requestor, name, reqType } = req.body;
    // console.log("from back- "+person, requestor, reqType);
    myql.setRequest(person, requestor, name, reqType, (error, response) => {
      if (error) {
        console.log(error);
        res.json(error);
      }
      if (response) {
        // console.log(response);
        res.json(response);
      }
    })
  }
  catch (error) {
    res.json("An error occured while requesting");
  }
})

app.post("/getRequests", authenticateToken, (req, res) => {
  try {
    const { person, requestor } = req.body;
    // console.log("from getRequests" + person, requestor);
    myql.getRequests(person, requestor, (error, responce) => {
      if (responce) {
        // console.log(responce);
        res.json(responce);
      }
      if (error) {
        res.json(error);
      }
    })
  }
  catch (error) {
    res.json("an error occured");
  }
})

app.post("/getAccepted", authenticateToken, (req, res) => {
  try {
    const { person, acceptor } = req.body;
    myql.getAccepted(person, acceptor, (error, responce) => {
      if (responce) {
        // console.log(responce);
        res.json(responce);
      }
      if (error) {
        res.json(error);
      }
    })
  }
  catch (error) {
    console.log("error while getting accepted requests", error);
    res.json("error while getting accepted requests");
  }
})

app.get("/getName", (req, res) => {
  try {
    const id = req.header("id");
    if (id) {
      myql.getName(id, (error, responce) => {
        if (responce) {
          res.json(responce);
        }
        if (error) {
          res.json(error);
        }
      })
    }
  }
  catch (error) {
    res.json(error);
    console.log(error);
  }
})

app.post("/accecptReq", authenticateToken, (req, res) => {
  try {
    const { person, requestor } = req.body;
    myql.acceptReq(person, requestor, (error, responce) => {
      if (responce) {
        res.json(responce);
      }
      if (error) {
        res.json(error);
      }
    })
  }
  catch (error) {
    res.json("error while accepting request");
    console.log("error while accepting request", error);
  }
})

app.post("/deleteReq", authenticateToken, (req, res) => {
  try {
    const { person, requestor } = req.body;
    myql.deleteReq(person, requestor, (error, responce) => {
      if (responce) {
        res.json(responce);
      }
      if (error) {
        res.json(error);
      }
    })
  }
  catch (error) {
    res.json("error while ignoring request");
    console.log("error while ignoring request ", error);
  }
})

// Authentication user token with db token

function authenticateToken(req, res, next) {
  try {
    const token = req.header("auth-token");

    if (!token || token == null) {
      return res.status(403).json("No token provided");
    }

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified.user;
    next();
  }
  catch (error) {
    console.log("wrong or illegal token", error);
  }
}

const port ="0.0.0.0";
app.listen(4000,port);
