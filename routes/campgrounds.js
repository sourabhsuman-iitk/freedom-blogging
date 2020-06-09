var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'sdevblog', 
  api_key: '584478888598275', 
  api_secret:'YZzItDXxrl9DL9T34cE-Xgofdjs'
});


//get using async
router.get("/", async (req, res) => {
    try{
        var noMatch = null;
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            const allCampgrounds = await Campground.find({name: regex});
            if(allCampgrounds.length < 1) {
                noMatch = "No blogs match that query, please try again.";
            }
            res.render("campgrounds/index", {campgrounds:allCampgrounds, noMatch: noMatch});
            
        } else {
            const allCampgrounds = await Campground.find().sort({createdAt: 'desc'});
            res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
        }
        
    }
    catch (err){
        console.log(err);
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.image = result.secure_url;
        // add author to campground
        req.body.author = {
            id: req.user._id,
            username: req.user.username
        }
 
        var newCampground = {name: req.body.name, image: req.body.image, content: req.body.content, description: req.body.description, author: req.body.author, slug: req.body.slug}
        Campground.create(newCampground, function(err, campground) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            } else {
                
                res.redirect("/blogs");
            }
       });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:slug", middleware.isLoggedIn, function(req, res){
    Campground.findOne({slug: req.params.slug}).populate("comments").exec(function(err, foundCampground){
        
        if(err || !foundCampground){
            req.flash("error", "Blog not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    }); 
});
//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById( req.params.id, function(err, foundCampground){
            
                    res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,{new: true},function(err, updatedCampground){
        if(err){
            res.redirect("/blogs");
        } else {
            req.flash("success","Blog Updated");
            res.redirect("/blogs/" + updatedCampground["slug"]);
        }
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            req.flash("success","Blog Deleted");
            res.redirect("/blogs");
        }
    });
}); 


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router ;