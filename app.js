const express= require("express");
const app= express();
const mongoose= require('mongoose');
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require('ejs-mate');
const ExpressError = require('./utils/expressError');
const listings= require('./routes/listing');
const reviews = require('./routes/review');

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

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

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