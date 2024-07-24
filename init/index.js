const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then(()=>console.log("Connected to DB")).catch((err)=>console.log(err));
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');   
}

async function init(){
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "667ea65544bdd340c38245ec", geometry}));
   await Listing.insertMany(initData.data);
   console.log("Data Initialised");
}

init();
































