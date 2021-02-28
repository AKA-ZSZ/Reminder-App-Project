// let database = require("../database");
// let database = require("../index").connection;
// const { MakeUser } = require("../make-data.js");
const { getPhoto } = require("./unsplashAPI_controller");
// const mongoose=require("mongoose");

// let User=mongoose.model("Users",{

//   email:String,
//   password:String,
//   photo:String

// });

let user = require("../models/mongoose/user").userModel;

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  loginSubmit: async (req, res) => {
    // implement
    let userEmail = await req.body.email;
    let userPassword = await req.body.password;

    /////////////////////////////////////////////
    // console.log("login", req.body);

    // if (database.hasOwnProperty(email)) {
    //   if (database[email].password === password) {
    //     req.session["user"] = email;
    //     res.redirect("/reminders");
    //   } else {
    //     res.render("auth/login", {
    //       err: "password is not correct",
    //     });
    //   }
    // } else {
    //   res.render("auth/login", {
    //     err: "The email does not exist",
    //   });
    // }
    ////////////////////////////////////////////


    await user.findOne({ email: userEmail })
      .then(userDoc => {
        if (userDoc.password === userPassword) {
          req.session["user"] = userEmail;
          res.redirect("/reminders");

        } else {
          res.render("auth/login", {
            err: "password is not correct",
          });

        }

      })
      .catch(err => {
        console.log(err);
        res.render("auth/login", {
          err: "The email does not exist",
        });

      });

  },

  register: (req, res) => {
    // get email from request
    let useremail = req.query.email;

    //send user email to signup page
    res.render("auth/register", { userEmail: useremail });
  },

  registerSubmit: async (req, res) => {
    // implement
    const email = req.body.email;
    const password = req.body.password;
    // const photo = req.body.photo;
    const photo = await getPhoto(req.body.photo);

    let newUser = new user({
      email: email,
      password: password,
      photo: photo
    });

    //save the new user to mongodb
    // newUser.save((err)=>{
    //   if(err){
    //     console.log(err);
    //     return;
    //   }else{
    //     console.log("saved.");
    //     req.session["user"] = email;
    //     res.redirect("/reminders");
    //   }
    // });

    newUser.save()
      .then(() => {
        // console.log("saved.");
        req.session["user"] = email;
        // create an empty reminder record and friends List record
      })
      .then(() => res.redirect("/reminders"))
      .catch(err => {
        console.log(err);
        return;

      });


    // if (!database.hasOwnProperty(email)) {
    //   const newUser = new MakeUser(
    //     Object.keys(database).length + 1,
    //     email,
    //     password,
    //     await getPhoto(photo)
    //   );
    //   console.log(newUser);
    //   database[email] = newUser;
    //   req.session["user"] = email;
    //   res.redirect("/reminders");
    // } else {
    //   res.render("auth/register", {
    //     useremail: "",
    //     err: "email has been registered",
    //   });
    // }
  },
  logout: (req, res) => {
    req.session = null;
    res.redirect("/login");
  },
};

module.exports = authController;
