// const Database = require("../database.js");
// const Database=require("../index").connection;

let user=require("../models/mongoose/user").userModel;
// const mongoose=require("mongoose");
// let user=mongoose.model("users");

module.exports = function(req, res, next){
    
    // let user = Database[req.session.user];
    // if (user) {
    //     next();
    // } else {
    //     res.render("auth/login");
    // }
    user.findOne({'email':req.session.user},(err,result)=>{
        if(err){
            console.log(err);
            res.render("auth/login");
        }else{
            // console.log(result);
            next();
        }
    });
}