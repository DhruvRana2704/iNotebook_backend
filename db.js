const mongoose = require('mongoose');
const URI="mongodb://localhost:27017/inotebook"
const connectToMongo=()=>{
    mongoose.connect(URI).then(()=>console.log("Connected to Mongo")).catch((e)=()=>console.log(e.message))
}
module.exports=connectToMongo;