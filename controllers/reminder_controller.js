const { MakeReminder, MakeSubtask, MakeTag } = require("../make-data.js");
// const Database = require("../database.js");
let mongoose = require('mongoose');
let userDatabase = require("../models/mongoose/user").userModel;
let reminderDatabase = require("../models/mongoose/reminder").reminderModel;
const url = require("url");

// exstract functions

let remindersController = {

  list: function (req, res) {
    res.locals.url = req.url;
    // console.log(req.session['user']);

    ///////////////////////////////////////
    // old version
    // let user = Database[req.session.user];
    // let friends = user.friendList;
    // console.log(friends);
    // let friendsList = [];
    // for (friend of friends) {
    //   friendsList.push(Database[friend]);
    // }

    // res.render("reminder/index", {
    //   reminders: user.reminders,
    //   others: friendsList,
    //   photoUrl: user.photo
    // });

    ///////////////////////////////////////
    // real database version
    userDatabase.findOne({ email: req.session['user'] })
      .then(user => {
        let friends = user.friendList;
        // console.log(friends);
        let friendsList = [];
        let remindersList = [];

        reminderDatabase.find({ email: { $in: friends } }, (err, friendDocs) => {
          if (err) {
            console.log(err);
            return;
          } else {
            friendDocs.forEach(doc => {
              friendsList.push(doc.toObject());

            });

            reminderDatabase.find({ email: req.session['user'] }, (err, docs) => {
              // console.log("docs:", docs);
              if (err) {
                console.log(err);
                return;
              } else {
                // console.log("docs:", docs);

                docs.forEach(doc => {
                  remindersList.push(doc.toObject());
                });
                res.render("reminder/index", {
                  reminders: remindersList,
                  others: friendsList,
                  photoUrl: user.photo
                });

              }

            });

          }
        });

        // }
        // return [user, friendsList];

        // return [friendsList, user.photo];

      })
      .catch(err => console.log(err));
    // .then(([friendsList,photo]) => {
    //   let remindersList = [];
    //   reminder.find({ email: req.session['user'] }, (err, docs) => {
    //     console.log("docs:",docs);
    //     if (err) {
    //       console.log(err);
    //       return;
    //     } else {
    //       // console.log("docs:", docs);

    //       docs.forEach(doc => {
    //         remindersList.push(doc.toObject());
    //       });

    //     }

    //   });

    //   return [remindersList, friendsList,photo];
    // })
    // .then(([friendsList, photo]) => {

    // console.log([remindersList, friendsList,photo]);

    // let remindersList = [];
    // reminder.find({ email: req.session['user'] }, (err, docs) => {
    // console.log("docs:", docs);
    // if (err) {
    //   console.log(err);
    //   return;
    // } else {
    // console.log("docs:", docs);

    //       docs.forEach(doc => {
    //         remindersList.push(doc.toObject());
    //       });
    //       res.render("reminder/index", {
    //         reminders: remindersList,
    //         others: friendsList,
    //         photoUrl: photo
    //       });

    //     }

    //   });
    // })

  },

  new: function (req, res) {
    // store the destination url in res.locals

    res.locals.url = req.url;

    res.render("reminder/create");
  },

  create: function (req, res) {
    // const subTaskArr = [];
    // const tagsArr = [];

    // const { reminder_subtask, reminder_tag } = req.body;

    // // Check if the subtask req exist
    // if (reminder_subtask) {
    //   reminder_subtask.forEach((description, subtask_id) => {
    //     subTaskArr.push(new MakeSubtask(subtask_id, description));
    //   });
    // }

    // // Check if the tag req exist
    // if (reminder_tag) {
    //   reminder_tag.forEach((description, tag_id) => {
    //     tagsArr.push(new MakeTag(tag_id, description));
    //   });
    // }
    // let user = Database[req.session.user];
    // const reminder = new MakeReminder(
    //   user.reminders.length + 1,
    //   req.body.title,
    //   req.body.description,
    //   subTaskArr,
    //   tagsArr
    // );

    // user.reminders.push(reminder);


    // console.log(user.reminders);

    // console.log("back to /reminders page");

    userDatabase.findOne({ email: req.session['user'] })
      .then(user => {
        const subTaskArr = [];
        const tagsArr = [];
        // console.log(req.body);
        const { reminder_subtask, reminder_tag } = req.body;
        // Check if the subtask req exist
        if (reminder_subtask) {
          reminder_subtask.forEach(async (description, subtask_id) => {

            let subtaskId = await new Date().getTime() + subtask_id;
            subTaskArr.push(new MakeSubtask(user._id + "_" + subtaskId, description));
          });
        }

        // Check if the tag req exist
        if (reminder_tag) {
          // reminder_tag.forEach((description, tag_id) => {

          reminder_tag.forEach(async (description, index) => {

            let tagId = await new Date().getTime() + index;
            // console.log(tagId);
            await tagsArr.push(new MakeTag(user._id + "_" + tagId, description));

          });
        }

        return [subTaskArr, tagsArr, user.photo];
      })
      .then(async function ([subTaskArr, tagsArr, photoUrl]) {
        const newReminder = await new reminderDatabase({
          email: req.session['user'],
          title: req.body.title,
          description: req.body.description,
          photo: photoUrl,
          subtask: subTaskArr,
          tag: tagsArr
        });

        await newReminder.save();
        return newReminder;

      })
      .then(newReminder => {
        //update user.reminders
        userDatabase.updateOne({ email: req.session['user'] },
          { $push: { reminders: newReminder._id } }, (err) => {
            if (err) {
              console.log(err);
              return;
            } else {
              res.redirect("/reminders");
            }
          }
        );
      })
      .catch(err => console.log(err));

  },


  listOne: function (req, res) {

    //////////////////////////////////
    // let reminderToFind = req.params.id;
    // let user = Database[req.session.user];

    // let searchResult = user.reminders.find(
    //   (reminder) => {
    //     return reminder.id == reminderToFind;
    //   }
    // );

    // if (searchResult != undefined) {
    //   res.render("reminder/single-reminder", {
    //     reminderItem: searchResult,
    //   });
    // } else {
    //   res.redirect("/reminders");
    // }

    //////////////////////////////////

    // console.log("list One!");
    let reminderToFind = req.params.id;

    //find the reminder in reminders collection
    reminderDatabase.findById(reminderToFind)
      .then(reminderDoc => {
        if (reminderDoc) {
          res.render("reminder/single-reminder", {
            reminderItem: reminderDoc.toObject(),
          });
        } else {
          res.redirect("/reminders");
        }

      })
      .catch(err => console.log(err));
  },

  edit: function (req, res) {

    //////////////////////////
    // old version
    // let user = userDatabase[req.session.user];
    // let reminderToFind = req.params.id;

    // let searchResult = user.reminders.find(
    //   (reminder) => {
    //     return reminder.id == reminderToFind;
    //   }
    // );
    // res.render("reminder/edit-reminder", {
    //   reminderItem: searchResult,
    // });

    ///////////////////////////

    let reminderToFind = req.params.id;
    reminderDatabase.findById(reminderToFind)
      .then(
        reminderDoc => {
          res.render("reminder/edit-reminder", {
            reminderItem: reminderDoc,
          });
        }
      )
      .catch(err => console.log(err));
  },

  update: function (req, res) {
    //////////////////////////////
    // old version
    // const reminder_id = req.params.id;
    // let user = userDatabase[req.session.user];

    // user.reminders.find((reminder) => {
    //   if (reminder.id == reminder_id) {
    //     (reminder.title = req.body.title),
    //       (reminder.description = req.body.description),
    //       (reminder.completed = req.body.completed == "true");
    //   }
    // });

    // res.redirect("/reminder/" + req.body.id); // this should be routes in index.js with redirects
    ////////////////////////////

    let reminderToFind = req.params.id;
    reminderDatabase.findById(reminderToFind)
      .then(
        async reminderDoc => {
          reminderDoc.title = req.body.title;
          reminderDoc.description = req.body.description;
          reminderDoc.completed = req.body.completed == "true";
          await reminderDoc.save();
          await res.redirect("/reminder/" + req.body.id);

        }
      )
      .catch(err => console.log(err));

  },

  delete: function (req, res) {
    //////////////////////////////
    // old version
    // let deleteId = req.params.id;
    // let user = userDatabase[req.session.user];

    // let idx = user.reminders.findIndex((reminder) => {
    //   return reminder.id == deleteId;
    // });
    // user.reminders.splice(idx, 1);
    // res.redirect("/reminders");
    ///////////////////////////////

    let deleteId = req.params.id;
    reminderDatabase.findOneAndDelete({ _id: deleteId })
      .then(
        async () => {
          await userDatabase.updateOne({ email: req.session.user }, { $pull: { reminders: mongoose.Types.ObjectId(deleteId) } })

          await res.redirect("/reminders");
        }
      )
      .catch(err => console.log(err));

  },

  showfriend: function (req, res) {
    res.locals.url = req.url;
    ///////////////////////////
    // let user = Database[req.session.user];
    // let friends = user["friendList"];
    // res.render("reminder/friends", {
    //   userfriends: friends
    // });
    /////////////////////////

    userDatabase.findOne({ email: req.session.user })
      .then(async user => {
        let friends = await user["friendList"];
        res.render("reminder/friends", {
          userfriends: friends
        });

      })
      .catch(err => console.log(err));


  },

  addfriend: async function (req, res) {
    // let buttonclicked=req.body.add;

    // console.log(buttonclicked);


    res.locals.url = req.url;
    let friendEmail = await req.body.friendEmail;

    ////////////////////////////////////////////////
    // let friendEmail = req.body.friendEmail;
    // console.log("email", req.body);
    // let user = Database[req.session.user]
    // let useremail = req.session.user

    // if (user.friendList.includes(friendEmail)) {
    //   res.render("reminder/friends", {
    //     err: "The email has already been added",
    //     userfriends: user.friendList
    //   });
    // } else if (friendEmail == useremail) {
    //   res.render("reminder/friends", {
    //     err: "You cannot add yourself",
    //     userfriends: user.friendList
    //   });
    // } else {
    //   if (Database.hasOwnProperty(friendEmail)) {
    //     user.friendList.push(friendEmail);
    //     Database[friendEmail].friendList.push(useremail);
    //   } else {
    //     res.render("reminder/friends", {
    //       err: "Email does not exist",
    //       userfriends: user.friendList
    //     });
    //   }
    // }
    // res.redirect("/reminder/friends");
    ////////////////////////////////////////////

    // The database must have that user with the friendEmail
    // Database.friendEmail["friendList"].push(user);

    // console.log(user["friendList"]);


    let userEmail = await req.session.user;
    userDatabase.findOne({ email: userEmail })
      .then(user => {

        if (user.friendList.includes(friendEmail)) {
          res.render("reminder/friends", {
            err: "The email has already been added",
            // user.friendList now is a list of friend email
            // need to use the email to find its reminders 
            userfriends: user.friendList
          });
        } else if (friendEmail == userEmail) {
          res.render("reminder/friends", {
            err: "You cannot add yourself",
            userfriends: user.friendList
          });
        } else {
          userDatabase.findOne({ email: friendEmail }, async (err, friendDoc) => {
            if (err) {
              console.log(err);
              return;
            } else {
              if (friendDoc) {
                await user.friendList.push(friendEmail);
                await friendDoc.friendList.push(userEmail);
                user.save();
                friendDoc.save();

              } else {
                res.render("reminder/friends", {
                  err: "Email does not exist",
                  userfriends: user.friendList
                });
              }
            }
          });
        }

        res.redirect("/reminder/friends");
      })
      .catch(err => console.log(err));


  },

  removeFriend: async function (req, res) {
    res.locals.url = req.url;
    //////////////////////////
    //old version
    // friendEmail = req.body.friendEmail;
    // // console.log("email", req.body);
    // let user = userDatabase[req.session.user]
    // let useremail = req.session.user

    // if (user.friendList.includes(friendEmail)) {
    //   let idx = user.friendList.findIndex((email) => {
    //     return email == friendEmail;
    //   });
    //   user.friendList.splice(idx, 1);
    //   // res.render("reminder/friends", {
    //   //   userfriends: user.friendList
    //   // });
    //   res.redirect("/reminder/friends");
    // } else if (friendEmail == useremail) {
    //   res.render("reminder/friends", {
    //     err: "You cannot delete yourself",
    //     userfriends: user.friendList
    //   });
    // } else {
    //   res.render("reminder/friends", {
    //     err: "Email does not exist",
    //     userfriends: user.friendList
    //   });

    // }
    ///////////////////////////

    let delFriendEmail = await req.body.friendEmail;
    let userEmail = await req.session.user;

    userDatabase.findOne({ email: req.session.user })
      .then(
        async userDoc => {
          if (delFriendEmail === userEmail) {
            res.render("reminder/friends", {
              err: "You cannot delete yourself",
              userfriends: userDoc.friendList
            });

          } else if (userDoc.friendList.includes(delFriendEmail)) {
            await userDatabase.updateOne({ email: req.session.user }, { $pull: { friendList: delFriendEmail } });
            await userDatabase.updateOne({ email: delFriendEmail }, { $pull: { friendList: userEmail } });
            await res.redirect("/reminder/friends");

          } else {
            res.render("reminder/friends", {
              err: "Email does not exist",
              userfriends: userDoc.friendList
            });

          }

        }

      )
      .catch(err => console.log(err));

  },


  listFriendReminder: function (req, res) {
    let friendEmail = req.params.email;
    let reminderToFind = req.params.id;
    // let userEmail = req.session.user;
    // console.log("friend email: ", friendEmail);
    // console.log("id: ", reminderToFind);

    // let searchResult = Database[friendEmail].reminders.find(
    //   (reminder) => {
    //     return reminder.id == reminderToFind;
    //   }
    // );


    // res.render("reminder/single-reminder", {
    //   reminderItem: searchResult,
    //   // userEmail:userEmail
    //   friendEmail: friendEmail

    // });

    reminderDatabase.findById(reminderToFind)
      .then(reminderDoc => {
        res.render("reminder/single-reminder", {
          reminderItem: reminderDoc.toObject(),
          // userEmail:userEmail
          friendEmail: friendEmail

        });

      }

      )
      .catch(err => console.log(err));
  },
};


module.exports = remindersController;
