const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js"); // Update path to './data.js'
// / Update the path to match your file structure


const MONGO_URL=("mongodb://127.0.0.1:27017/WONDERFULL");
main().then(()=>{
    console.log("connect to Db")

})
.catch((err)=>{
    console.log(err);
});


 async function  main(){
    await mongoose.connect(MONGO_URL)
 }
 const initDb= async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"66fd859e3574d4b7623ab4a0"}));
    await Listing.insertMany(initData.data);
    console.log("data is initialize");

 };
  initDb();
 
