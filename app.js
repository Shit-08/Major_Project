const express= require("express");
const app= express();
const mongoose= require('mongoose');
const Listing= require("./models/listing");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err=>console.log(err));

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});

app.get('/', (req, res)=>{
    res.send("hi i am root");
});