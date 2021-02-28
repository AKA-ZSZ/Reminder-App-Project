const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controllers/reminder_controller");
const authController = require("./controllers/auth_controller");

const cookieSession = require("cookie-session");
const authCheck = require("./middleware/auth");
const buttonCheck = require("./middleware/buttonCheck");
const middlewares = require("./middlewares.js");

// express is going to return back to us a web server
const subtaskApp = require("./subtask-routes.js");
const timeApp = require("./time-routes");
const tagApp = require("./tag-routes");
const { loginPage } = require("./controllers/reminder_controller");
const youtubeApp = require("./youtubeAPI");

// mongodb
let mongoose=require("mongoose");
const dbUrl="mongodb+srv://user:214300@cluster0.atxvw.mongodb.net/<dbname>?retryWrites=true&w=majority";


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["aaa", "bbb", "ccc"],
    maxAge: 30 * 60 * 1000, // cookie expires in 30 min
  })
);

// app.use(middlewares.currenUser);

//Case 1: user goes to localhost: 8080 -> information about site, marketing, login page ...
app.get("/", (req, res) => {
  res.send("Go to http://localhost:3000/reminders");
});

// Case xxx: friends
app.get("/reminder/friends", authCheck, reminderController.showfriend);

app.post("/reminder/friends", authCheck, buttonCheck);

app.post("/reminder/friends",authCheck,reminderController.removeFriend);

//Case 2: User goes to Localhost:8080/reminder -> show a list of reminders
app.get("/reminders/", authCheck, reminderController.list);

//Case 3: user goes to localhost:8080/reminder -> show a CREATE REMINDER RAGE
app.get("/reminder/new", authCheck, reminderController.new);

//Case 4: User SENDS NEW REMINDER DATA TO US (CREATING A REMINDER)
app.post(
  "/reminders",
  authCheck,
  middlewares.parseBodyToArr,
  reminderController.create
);

// Case 5: User wants to see an individual reminder
app.get("/reminder/:id", authCheck, reminderController.listOne);

//
// app.get("/reminder/:email/:id", authCheck, reminderController.listFriendReminder);

// Case 6: User wnats to EDIT an individual reminder
app.get("/reminder/:id/edit", authCheck, reminderController.edit);

app.get(
  "/reminder/:email/:id",
  authCheck,
  reminderController.listFriendReminder
);

//Case 7: User clicks the update button from Case 6, and expects their reminder to be updated
app.post("/reminder/update/:id", authCheck, reminderController.update);

//Case 8: User clicks the delete button and we expect the reminder to be deleted
app.post("/reminder/delete/:id", authCheck, reminderController.delete);

//Case 9: User wants to go to register page
app.get("/register", authController.register);

//Case 10: User wants to go to login page
app.get("/login", authController.login);

//Case 11: User wants to register for an account
app.post("/register", authController.registerSubmit);

//Case 12: User wants to login with account info
app.post("/login", authController.loginSubmit);

// Case 13: User wants to logout
app.post("/logout", authController.logout);

//======= Subtask =============

//Case 1: User wants to add subtasks
subtaskApp.post(app);

//Case 2: User wnats to delete subtasks
subtaskApp.deletePost(app);

//===========time=============

//Case:1: User add a reminder time
timeApp.post(app);

//===========tags=============

//Case:1: User wants to add a tag
tagApp.post(app);

//Case 2: User wants to delete a tag
tagApp.deletePost(app);

//========= Youtube Api =======

// Case 1: User wants to search for youtube videos
youtubeApp.get(app);

// Case 2: User gets youtube videos
youtubeApp.post(app);

// Case 3: User wants add their favorite videos
youtubeApp.add(app);

module.exports.connection=mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
  if(err){
    console.log(err);
  }else{
    console.log('a user connected');
    // web service request through port 3000
    app.listen(3000, () => {
      console.log("Our server is running on http://localhost:3000/ 🚀");
    });

  }
  
});

// web service request through port 3000
// app.listen(3000, () => {
//   console.log("Our server is running on http://localhost:3000/ 🚀");
// });
