var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// Campgrounds route
router.get("/", function(req, res){

    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id ,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author}
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/blogs");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }); 
});
//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
                    res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,{new: true},function(err, updatedCampground){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
}); 



module.exports = router;  