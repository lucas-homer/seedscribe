const mongoose = require("mongoose");

// schema setup
const gardenSchema = new mongoose.Schema({
    name: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    plants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plant"
        }
    ]
});

// model creation and export
module.exports = mongoose.model("Garden", gardenSchema);