var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");
var Campground = require("../models/campground");


// User Profile
router.get("/:id",middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
        
    });
});

//saved get route
router.get("/saved/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
      if(err) {
          req.flash("error", "Something went wrong");
          res.redirect("back");
      }
      var userid = JSON.stringify(foundUser.id);
      
      Campground.find().exec( function(err, foundCampground){
          if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
          } else {
              var n = foundCampground.length;
              var sample = new Array();
            //   for (var i = 0; i < n; i++)
            //   sample.push(new Object());
              
              for(var i=0; i< foundCampground.length; i++){
                  var arr = foundCampground[i].saved ;
                
                  for (var j=0 ; j<arr.length; j++ ){
                   
                      if(JSON.stringify(arr[j]) === userid){
                       
                          sample[i] = foundCampground[i] ;
                          }
                    }
                }  
                  res.render("users/saved", {user: foundUser, campgrounds: sample});  
          }
      
        })
    })
})

//saved post route
router.post("/saved/:id/:userid", middleware.isLoggedIn, function(req, res){
  var userIDString = JSON.stringify(req.params.userid) ;
  var userID =  req.params.userid ;
  Campground.findById(req.params.id, function(err, campground){
      if(err){
          req.flash("error", "Something went wrong");
          res.redirect("back");
      } else { 

            var isSaved = false ;
          for( var i=0; i<campground.saved.length ; i++) {
            if(userIDString === (JSON.stringify(campground.saved[i]))){
               isSaved = true ;
            } 
          }
          if(!isSaved){
            campground.saved.push(userID);
            campground.save();
            req.flash("success", "Blog pinned");
            res.redirect('/blogs/' + campground.slug);
          } else {
            req.flash("error", "Blog already pinned");
            res.redirect("back");
          }
          
      }
    })
})


module.exports = router;  