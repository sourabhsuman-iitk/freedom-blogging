var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds")

require('dotenv').config();
const port = process.env.port || 5000;
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongodb database connection established successfully");
});
// Campground.create(
//    { 
//     name: "Bear creek" ,
//      image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//      description: "This is a creek thats a usual spot for bears"
    
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created campground");
//             console.log(campground);
//         }
//     });
 
app.get("/", function(req, res){
    res.redirect("/campgrounds");
});

app.get("/campgrounds", function(req, res){

    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render("show", {campground: foundCampground});
        }
    }); 
});

app.listen(port, () => {
    console.log('Yelpcamp has started on port');
});