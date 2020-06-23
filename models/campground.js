var mongoose = require("mongoose");
var slugify = require("slugify");
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    content: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }, 
    author : { 
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    saved:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sortOrder: String,
    tag: String
});

campgroundSchema.pre('validate', function(next){
    if(this.name){
        this.slug = slugify(this.name, { lower: true, strict: true})
    }

    next()
})

module.exports = mongoose.model("Campground", campgroundSchema);
 