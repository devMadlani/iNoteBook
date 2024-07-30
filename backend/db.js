const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook"

const connectToMongo = async ()=>{
    try{
        await mongoose.connect(mongoURI);
        console.log("DB connected")
    }
    catch(error){
        console.error("Failed to connect to MongoDB", err);
    }
    
}

module.exports = connectToMongo;