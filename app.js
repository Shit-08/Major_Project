const express= require("express");
const app= express();
const mongoose= require('mongoose');
const Listing= require("./models/listing");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require('./utils/expressError');
const {listingSchema}= require("./schema");
const { valid } = require("joi");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true})); //to parse all data that from request 
app.use(methodOverride("_method"));//middleware for method override
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err=>console.log(err));

//schema validation function using joi
const validateListing= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    console.log(error.details);
    if(error){
        let errMsg= error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index Route
app.get('/listings',async(req,res)=>{
    let listings= await Listing.find();
    res.render("listings/index.ejs",{listings});

});

//New Route
app.get('/listings/new', (req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get('/listings/:id', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post('/listings', validateListing, wrapAsync(async(req,res,next)=>{
    // let {title, description ,image, price, country, location }= req.body;
    // let data= new Listing({title : title, description: description, image}); // long syntax for creating Listing model instance for inserting data in collection
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));

//Edit Route
app.get('/listings/:id/edit', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put('/listings/:id', validateListing, wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true , runValidators: true});// spread operator
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete('/listings/:id', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

//it will run for every request that didn’t match earlier routes.
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
})

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});

app.get('/', (req, res)=>{
    res.send("hi i am root");
});