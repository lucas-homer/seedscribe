const mongoose = require("mongoose");

// schema setup
const plantSchema = new mongoose.Schema({
    plantName: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

module.exports = mongoose.model("Plant", plantSchema);