const mongoose= require('mongoose');
const schema = mongoose.Schema;

const listingSchema= new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image:{
        type: String,
        default: "https://unsplash.com/photos/a-house-with-a-swimming-pool-in-front-of-it-7ugCvlbjv-E",
        set: (v)=>{v==="" ? "https://unsplash.com/photos/a-house-with-a-swimming-pool-in-front-of-it-7ugCvlbjv-E" : v }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;