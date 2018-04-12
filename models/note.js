const mongoose = require("mongoose");

// schema setup
const noteSchema = new mongoose.Schema({
    text: String,
    date: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// create model from schema and export model
module.exports = mongoose.model("Note", noteSchema);