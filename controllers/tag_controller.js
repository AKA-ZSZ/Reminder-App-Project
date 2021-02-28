const { MakeTag } = require("../make-data.js");

// const Database = require("../database.js");

let reminderDatabase = require("../models/mongoose/reminder").reminderModel;

let tagController = {
  add: function (req, res) {
    let tagName = req.body.tag_name;
    let tagID = req.params.id;

    /////////////////////////////////////
    // old version
    // let user = Database[req.session.user];

    // let searchResultID = user.reminders.findIndex((reminder) => {
    //   return reminder.id == tagID;
    // });

    // let searchReminder = user.reminders[searchResultID];

    // console.log(searchReminder);
    // let newtag = new MakeTag(searchReminder.tag.length + 1, tagName);
    // {
    //   id: searchReminder.tag.length + 1,
    //   name: tagName
    // };

    // searchReminder.tag.push(newtag);

    // res.redirect("/reminder/" + tagID);
    //////////////////////////////////////

    reminderDatabase.findById(tagID)
      .then(async reminderDoc => {
        let newtag = await new MakeTag(tagID + "_" + new Date().getTime(), tagName);
        await reminderDoc.tag.push(newtag);
        await reminderDoc.save();

        res.redirect("/reminder/" + tagID);

      })
      .catch(err => console.log(err));
  },

  delete: function (req, res) {
    let deleteId = req.params.id;
    let tagId = req.body.id;
    console.log(tagId);

    ////////////////////////////
    // old 
    // let user = Database[req.session.user];

    // let searchResult = user.reminders.find((reminder) => {
    //   return reminder.id == deleteId;
    // });

    // let searchtagID = searchResult.tag.findIndex((tag) => {
    //   return tag.id == tagId;
    // });

    // searchResult.tag.splice(searchtagID, 1);
    // res.redirect("/reminder/" + deleteId);
    //////////////////////////////

    reminderDatabase.updateOne({ _id: deleteId }, { $pull: { tag: { id: tagId } } })
      .then( ()=> {
        // await reminderDoc.tag.splice(tagId,1);

        // await reminderDoc.save();
        res.redirect("/reminder/" + deleteId);

      })
      .catch(err => console.log(err));
  },
};

module.exports = tagController;
