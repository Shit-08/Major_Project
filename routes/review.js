const express= require('express');
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Review= require('../models/review');
const Listing= require("../models/listing");
const {validateReview} = require('../middleware');


//Reviews 
//Post create route
router.post("/",validateReview, wrapAsync(async(req, res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports= router;