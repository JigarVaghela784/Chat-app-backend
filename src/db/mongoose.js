const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const DB= process.env.DATABASE;
mongoose.set('strictQuery', false);
mongoose.connect(DB, {
  useNewUrlParser: true,
}).then(()=>{
    console.log("Success")
}).catch(()=>{
    console.log("Error")
});