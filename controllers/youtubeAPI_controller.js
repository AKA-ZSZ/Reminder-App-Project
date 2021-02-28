const fetch = require("node-fetch");
const { MakeVideo } = require("../make-data.js");
// const Database = require("../database.js");
let userDatabase = require("../models/mongoose/user").userModel;



let youtubeAPIController = {
  list: (req, res) => {

    res.locals.youtubeData = null;
    // res.locals.userVideoList = req.currentUser.videoList;

    userDatabase.findOne({ email: req.session.user })
      .then(userDoc => {
        res.locals.userVideoList = userDoc.videoList;
        res.locals.isclicked = "youtubeClicked";
        res.locals.url = req.url;
        // console.log(res.locals.currentUser);
        res.render("reminder/search-youtube.ejs");
      })
      .catch(err => console.log(err));


    //
  },
  newVideos: async (req, res) => {
    const { searchTerm } = req.body;
    const enSearchTerm = encodeURIComponent(searchTerm);
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${enSearchTerm}&type=video&key=AIzaSyAf4_tbubtzBl_itVwJNJtf7Ug8P2kto00`
      );
      const json_data = await data.json();
      const youtubeData = json_data.items;
      res.locals.youtubeData = youtubeData;
      // res.locals.userVideoList = req.currentUser.videoList;
      userDatabase.findOne({ email: req.session.user })
        .then(userDoc => {
          res.locals.userVideoList = userDoc.videoList;
          res.render("reminder/search-youtube.ejs");
        })
        .catch(err => console.log(err));


    } catch {
      res.send("500 x.x Youtube Api not available");
    }
  },

  addVideo: async (req, res) => {
    // const currenUser = req.currentUser;
    // const { ytvideoId, ytvideoTitle, ytvideoImg } = req.body;
    // const video = new MakeVideo(
    //   currenUser.videoList.length + 1,
    //   ytvideoTitle,
    //   ytvideoImg,
    //   ytvideoId
    // );
    // Database[currenUser.email].videoList.push(video);
    // res.redirect("/reminders/ytvideos");

    const currentUser = req.session.user;
    const { ytvideoId, ytvideoTitle, ytvideoImg } = req.body;

    userDatabase.findOne({ email: currentUser })
      .then(async userDoc => {
        const video = await new MakeVideo(
          userDoc._id + "_" + ytvideoId,
          ytvideoTitle,
          ytvideoImg,
          ytvideoId
        );
        let isExisted=false;
        await userDoc.videoList.forEach(favoriteVideo=>{
          if(favoriteVideo.id===userDoc._id + "_" + ytvideoId){
            isExisted=true;
            
          }
        })

        if (!isExisted){
          await userDoc.videoList.push(video);
          await userDoc.save();
        }
        await res.redirect("/reminders/ytvideos");
        


      })
      .catch(err => console.log(err));


  },
};

module.exports = youtubeAPIController;
