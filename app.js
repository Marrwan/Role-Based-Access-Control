require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressLayout = require("express-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

require("./config/passport")(passport);

// ROUTES
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

//db
const db = require("./config/config").mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayout);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Abdul",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(flash());

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Message handler
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.User = req.user;

  next();
});

app.use("/", indexRouter);
app.use(usersRouter);

module.exports = app;
