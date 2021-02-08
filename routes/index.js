var express = require("express");
const { isLoggedIn } = require("../auth/auth");
const User = require("../models/User");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/dashboard", isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    res.render("dashboard", { users });
  });
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});
module.exports = router;
