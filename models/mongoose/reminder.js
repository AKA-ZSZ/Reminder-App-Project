// The mongoose schema and model for user

const mongoose=require("mongoose");

const reminderSchema=new mongoose.Schema({
    email:String,
    title:String,
    description:String,
    completed:{ type: Boolean, default: false },
    photo:String,
    subtask:{ type: Array, default: [] },
    tag:{ type: Array, default: [] },
    time:{ type: String, default: new Date().toISOString() }
});

module.exports.reminderModel=mongoose.model("Reminder",reminderSchema);