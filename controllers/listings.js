const Listing = require("../models/listing");

module.exports.index=async(req,res)=>{
    let listings= await Listing.find();
    res.render("listings/index.ejs",{listings});
}

module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.show = async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.create = async(req,res,next)=>{
    // let {title, description ,image, price, country, location }= req.body;
    // let data= new Listing({title : title, description: description, image}); // long syntax for creating Listing model instance for inserting data in collection
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect('/listings');
};

module.exports.edit = async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are trying to access does not exist");
        return res.redirect('/listings');
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.update = async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true , runValidators: true});// spread operator
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
};