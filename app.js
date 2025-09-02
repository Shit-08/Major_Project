const express= require("express");
const app= express();
const mongoose= require('mongoose');
const Listing= require("./models/listing");
const path= require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});

app.get('/', (req, res)=>{
    res.send("hi i am root");
});