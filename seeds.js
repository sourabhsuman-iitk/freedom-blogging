var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

 
var data = [
    {
        name: "Cloud Rest",
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Clouds rest in this place"
    },
    {
        name: "Field Shape",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Fields rest in this place"
    },
    {
        name: "Dawn's Flake",
        image: "https://images.unsplash.com/19/nomad.JPG?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Dawn rests in this place"
    }
]
function seedDB(){
    Campground.remove({}, function(err){
        // if(err){
        //     console.log(err);
        // } else {
        //     console.log("removed campgrounds");
        //     data.forEach(function(seed){
        //         Campground.create(seed, function(err, campground){
        //             if(err)
        //              {
        //                 console.log(err);
        //             } else {
        //                 console.log("added a campground");
        //                 //create comment
        //                 Comment.create(
        //                     {
        //                         text:"This is awesome",
        //                         author: "Dom"
        //                     }, function(err, comment){
        //                         if(err){
        //                             console.log(err);
        //                         } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("created a new comment");    
        //                         }
        //                     }
        //                     )
        //             }
        //         });
        //     }); 
        // }
    });
};

module.exports = seedDB;