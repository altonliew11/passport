const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const users = require("./users.js");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(passport.initialize());
require("./passport.js")(passport);

const add = (n1, n2) => {
  return n1 + n2;
}

// Registering New User
app.post("/register", (req, res) => {
  try {
    let newUser = {
      id: req.query.id,
      username: req.query.username,
      password: req.query.password,
    };
    users.push(newUser);
    res.status(200).send({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});

// Login
app.post("/login", (req, res) => {
  try {
    users.find((user) => {
      let userName = req.query.username;
      let passWord = req.query.password;

      //If username provided does not match with any username within the array then return error
      if (userName !== user.username) {
        throw new Error("No users found!");
      }

      //If password does not match then return an error
      if (passWord !== user.password) {
        throw new Error("Incorrect password");
      }

      //Create payload object
      const payload = {
        username: user.username,
      };

      //Create token and send it as a response
      const token = jwt.sign(payload, "random string", { expiresIn: "1d" });
      return res.status(200).send({
        sucess: true,
        message: "Logged in successfully!",
        token: "Bearer " + token,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});

// app.get(
//   "/protected",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     return res.status(200).send({
//       success: true,
//       user: {
//         id: req.user._id,
//         username: req.user.username,
//       },
//     });
//   }
// );

app.get(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        password: req.user.password,
      },
    });
  }
);


app.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
  try {
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    if (isNaN(n1)) {
      throw new Error("n1 incorrectly defined");
    }
    if (isNaN(n2)) {
      throw new Error("n2 incorrectly defined");
    }
    if (n1 === NaN || n2 === NaN) {
      throw new Error("Parsing Error");
    }
    const result = add(n1, n2);
    res.status(200).json({ statuscocde: 200, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
})

app.listen(3000, () => {
  console.log("Listening to port 3000");
});

module.exports = app;
