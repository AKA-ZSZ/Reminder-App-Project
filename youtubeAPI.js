const youtubeAPIcontroller = require("./controllers/youtubeAPI_controller.js");
// let middlewares=require("./middlewares");
let authCheck=require("./middleware/auth");

let youtubeApp = {
  get: function (app) {
    app.get("/reminders/ytvideos",authCheck, youtubeAPIcontroller.list);
  },
  post: function (app) {
    app.post("/reminders/ytvideos",authCheck, youtubeAPIcontroller.newVideos);
  },
  add: function (app) {
    app.post("/reminders/ytvideos/add",authCheck,youtubeAPIcontroller.addVideo);
  },
};

module.exports = youtubeApp;
