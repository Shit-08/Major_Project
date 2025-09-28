const mongoose= require('mongoose');
const initData = require('./data');
const Lists= require('../models/listing');


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err=>console.log(err));

const initDb= async()=>{
    await Lists.deleteMany({ });
    initData.data = initData.data.map((obj)=>({...obj, owner: "68d54aa6b079476a8a5c05e7"}));
    await Lists.insertMany(initData.data);
    console.log("data was initialized");
};

initDb();
