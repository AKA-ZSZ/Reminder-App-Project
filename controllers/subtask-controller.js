const { MakeSubtask } = require("../make-data.js");

// const Database = require("../database.js");
let reminderDatabase = require("../models/mongoose/reminder").reminderModel;

let subtaskController = {
  update: function (req, res) {
    // get user input for subtask and reminder id
    let subtaskMsg = req.body.subtask__msg;
    let subtaskToFind = req.params.id;

    /////////////////////////////////////
    // old version
    // let user = Database[req.session.user];

    // // find the index of specific reminder that matched with a reminder id
    // let searchResultID = user.reminders.findIndex((reminder) => {
    //   return reminder.id == subtaskToFind;
    // });

    // // get spcific reminder
    // let searchReminder = user.reminders[searchResultID];

    // console.log(searchReminder);
    // // subtask data strcuture
    // let newSubtask = new MakeSubtask(
    //   searchReminder.subtask.length + 1,
    //   subtaskMsg
    // );

    // // add subtask to subtask lists for specific reminder
    // searchReminder.subtask.push(newSubtask);

    // // redirect to single reminder page
    // res.redirect("/reminder/" + subtaskToFind);
    //////////////////////////////////////

    reminderDatabase.findById(subtaskToFind)
      .then(async reminderDoc => {
        let newSubtask = await new MakeSubtask(
          subtaskToFind + "_" + new Date().getTime(),
          subtaskMsg
        );
        await reminderDoc.subtask.push(newSubtask);
        await reminderDoc.save();

        res.redirect("/reminder/" + subtaskToFind);

      })
      .catch(err => console.log(err));

  },

  delete: function (req, res) {
    let deleteId = req.params.id;
    let subtaskId = req.body.id;

    ////////////////////////////
    // old 
    //   let user = Database[req.session.user];

    //   //get a single reminder from reminder list
    //   let searchResult = user.reminders.find((reminder) => {
    //     return reminder.id == deleteId;
    //   });

    //   // get a single subtask index from subtask list
    //   let seachSubtaskID = searchResult.subtask.findIndex((subtask) => {
    //     return subtask.id == subtaskId;
    //   });

    //   // delete subtask from the subtask list
    //   searchResult.subtask.splice(seachSubtaskID, 1);
    //   res.redirect("/reminder/" + deleteId);
    //////////////////////////////

    reminderDatabase.updateOne({ _id: deleteId }, { $pull: { subtask: { id: subtaskId } } })
      .then(() => {
        
        res.redirect("/reminder/" + deleteId);

      })
      .catch(err => console.log(err));

  },
};

module.exports = subtaskController;
