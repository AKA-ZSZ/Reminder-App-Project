// const database = require("./database");

let middlewares = {
  parseBodyToArr: function (req, res, next) {
    let { reminder_subtask, reminder_tag } = req.body;
    req.body.reminder_subtask =
      typeof reminder_subtask === "string"
        ? [reminder_subtask]
        : reminder_subtask;
    req.body.reminder_tag =
      typeof reminder_tag === "string" //
        ? [reminder_tag] //
        : reminder_tag;
    next();
  },
  // currenUser: function (req, res, next) {
  //   if (req.session.user) {
  //     if (database[req.session.user]) {
  //       req.currentUser = database[req.session.user];
  //       res.locals.currentUser = req.currentUser;
  //       next();
  //     } else {
  //       next();
  //     }
  //   } else {
  //     next();
  //   }
  // },
};

module.exports = middlewares;
