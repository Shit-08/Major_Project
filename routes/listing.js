const express= require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing= require("../models/listing");
const ExpressError = require('../utils/expressError');
const {listingSchema}= require("../schema");

//schema validation function using joi
const validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index Route
router.get('/',async(req,res)=>{
    let listings= await Listing.find();
    res.render("listings/index.ejs",{listings});

});

//New Route
router.get('/new', (req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get('/:id', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
}));

//Create Route
router.post('/', validateListing, wrapAsync(async(req,res,next)=>{
    // let {title, description ,image, price, country, location }= req.body;
    // let data= new Listing({title : title, description: description, image}); // long syntax for creating Listing model instance for inserting data in collection
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect('/listings');
}));

//Edit Route
router.get('/:id/edit', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect('/listings');
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put('/:id', validateListing, wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true , runValidators: true});// spread operator
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete('/:id', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}));

module.exports= router;