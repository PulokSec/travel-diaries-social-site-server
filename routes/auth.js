const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const protected = require("../access/access");

router.get("/authorized", protected, (req, res) => {
  res.send("Hello auth");
});

router.post("/signup", (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({
      error: "Please complete all the fields",
    });
  }
  User.findOne({
    email: email,
  })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "An User has already existed with this email",
        });
      }
      bcrypt.hash(password, 12).then((pass) => {
        const user = new User({
          name,
          email,
          password: pass,
          photo,
        });
        user
          .save()
          .then((user) => {
            res.json({
              message: "User successfully Saved",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Invalid Email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
