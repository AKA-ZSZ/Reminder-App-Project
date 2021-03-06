const { MakeSubtask } = require("../make-data.js");

const Database = require("../database.js");

let subtaskController = {
  update: function (req, res) {
    // get user input for subtask and reminder id
    let subtaskMsg = req.body.subtask__msg;
    let subtaskToFind = req.params.id;
    let user = Database[req.session.user];

    // find the index of specific reminder that matched with a reminder id
    let searchResultID = user.reminders.findIndex((reminder) => {
      return reminder.id == subtaskToFind;
    });

    // get spcific reminder
    let searchReminder = user.reminders[searchResultID];

    // subtask data strcuture
    let newSubtask = new MakeSubtask(
      searchReminder.subtask.length + 1,
      subtaskMsg
    );

    // add subtask to subtask lists for specific reminder
    searchReminder.subtask.push(newSubtask);

    // redirect to single reminder page
    res.redirect("/reminder/" + subtaskToFind);
  },

  delete: function (req, res) {
    let deleteId = req.params.id;
    let subtaskId = req.body.id;
    let user = Database[req.session.user];

    //get a single reminder from reminder list
    let searchResult = user.reminders.find((reminder) => {
      return reminder.id == deleteId;
    });

    // get a single subtask index from subtask list
    let seachSubtaskID = searchResult.subtask.findIndex((subtask) => {
      return subtask.id == subtaskId;
    });

    // delete subtask from the subtask list
    searchResult.subtask.splice(seachSubtaskID, 1);
    res.redirect("/reminder/" + deleteId);
  },
};

module.exports = subtaskController;
