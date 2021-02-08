var express = require("express");
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcryptjs");
var passport = require("passport");

// SIGNUP ROUTE
router
  .route("/signup")
  //  GET signup form
  .get((req, res) => {
    res.render("signup");
  })
  // POST signup handle
  .post((req, res) => {
    const {
      name,
      username,
      email,
      password,
      confirm,
      gender,
      userType,
    } = req.body;

    let errors = [];

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirm ||
      !userType ||
      !gender
    ) {
      errors.push({ msg: "Please fill in all fields" });
    }

    if (password.length <= 5) {
      errors.push({ msg: "Password must be greater than five characters" });
    }

    if (password != confirm) {
      errors.push({ msg: "Passwords do not match" });
    }

    if (errors.length > 0) {
      res.render("signup", {
        errors,
        email,
        name,
        username,
        password,
        confirm,
        userType,
        gender,
      });
    } else {
      User.findOne({ email: email }).then((founduser) => {
        errors.push({ msg: "A user with that email already exist" });
        if (founduser) {
          res.render("signup", {
            errors,
            email,
            name,
            username,
            password,
            confirm,
            userType,
            gender,
          });
        } else {
          const newUser = new User({
            email,
            name,
            password,
            username,
            userType,
            gender,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hashed) => {
              newUser.password = hashed;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/login");
                })
                .catch((err) => {
                  throw err;
                });
            });
          });
        }
      });
    }
  });

// LOGIN ROUTE
router
  .route("/login")
  // GET show login form
  .get((req, res) => {
    res.render("login");
  })
  //  POST handle login
  .post((req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  });
module.exports = router;
