var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");



var commentRoutes = require("./routes/comments"); 
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var userRoutes = require("./routes/users")

require('dotenv').config();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongodb database connection established successfully");
});
 
 
//Passport config
app.use(require("express-session")({
    secret: "You are awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); 
});

app.use(indexRoutes);
app.use("/blogs", campgroundRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/users", userRoutes)

app.use(function(req, res, next){
    res.status(404).render("error");
});

app.listen(port, () => {
    console.log('Yelpcamp has started on port');
});