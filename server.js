const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const users = require("./users.js");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(passport.initialize());
require("./passport.js")(passport);

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
  "/protected",
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

app.listen(3000, () => {
  console.log("Listening to port 3000");
});

module.exports = app;
