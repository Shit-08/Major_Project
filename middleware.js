const Listing= require("./models/listing");
const ExpressError = require('./utils/expressError');
const {listingSchema, reviewSchema} = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//middleware for listing authorization
module.exports.isOwner = async(req, res, next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    // console.log("listing owner",listing.owner);
    // console.log("current user", res.locals.currUser._id );
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you don't have permission to edit or delete!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//schema validation function using joi
module.exports.validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// server side schema validation function for reviews schema model using joi
module.exports.validateReview= (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//middleware for review authorization
module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId }= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}