
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res){

    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res. redirect("/blogs");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully created Comment");
                    res.redirect('/blogs/' + campground.slug );
                }
            })
        }
    })
});

//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No blog found");
            return res.redirect("back");
        }
            var slug = foundCampground["slug"]
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment , slug: slug});
                }
            });
    });
    
});

//comment update route
router.put("/:comment_id/:slug", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,{new: true}, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment Edited");
            res.redirect("/blogs/" + req.params.slug );
        }
    });
});

// comment delete rooute
router.delete("/:comment_id/:slug", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment Deleted");
            res.redirect("/blogs/"+ req.params.slug);
        }
    });
});
 
module.exports = router;  