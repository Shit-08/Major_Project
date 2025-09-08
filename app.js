const express= require("express");
const app= express();
const mongoose= require('mongoose');
const Listing= require("./models/listing");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require('ejs-mate');

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
app.get('/listings/:id', async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create Route
app.post('/listings', async(req,res)=>{
    console.log(req.body);
    // let {title, description ,image, price, country, location }= req.body;
    // let data= new Listing({title : title, description: description, image}); // long syntax for creating Listing model instance for inserting data in collection
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
});

//Edit Route
app.get('/listings/:id/edit', async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put('/listings/:id', async(req,res)=>{
    let {id}= req.params;
    console.log(req.body.listing);
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true , runValidators: true});// spread operator
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete('/listings/:id', async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})


app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});

app.get('/', (req, res)=>{
    res.send("hi i am root");
});