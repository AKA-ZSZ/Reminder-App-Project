// const Database = require("../database.js");
let reminderDatabase = require("../models/mongoose/reminder").reminderModel;

let timeController = {
    update: function (req, res) {
        // get user input for time and reminder id
        let inputTime = req.body.time;
        let reminderId = req.params.id;
        console.log(reminderId);

        //////////////////////////////////////
        // old version
        // let user = Database[req.session.user];
        // find the index of specific reminder that matched with a reminder id
        // let searchResultID = user.reminders.findIndex((reminder) => {
        //     return reminder.id == page_id;
        // });

        // get spcific reminder
        // let searchReminder = user.reminders[searchResultID];

        // searchReminder.time=inputTime;
        ///////////////////////////////////////

        reminderDatabase.findByIdAndUpdate(reminderId,{ time:inputTime },{ useFindAndModify:false })
        .then(()=>{
            res.redirect("/reminder/" + reminderId);

        })
        .catch(err=>console.log(err));
        // res.redirect("/reminder/" + reminderId);
        // console.log(Database.cindy.reminders[searchResultID]);
        
    },

    
}

module.exports=timeController;