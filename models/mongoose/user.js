// The mongoose schema and model for user

const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    photo:String,
    reminders:{ type: Array, default: [] },
    friendList:{ type: Array, default: [] },
    videoList:{ type: Array, default: [] },


});

module.exports.userModel=mongoose.model("User",userSchema);