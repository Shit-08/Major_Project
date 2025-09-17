const express= require('express');
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require('../utils/expressError');
const {reviewSchema}= require("../schema");
const Review= require('../models/review');
const Listing= require("../models/listing");


// server side schema validation function for reviews schema model using joi
const validateReview= (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Reviews 
//Post create route
router.post("/",validateReview, wrapAsync(async(req, res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports= router;