const mongoose = require("mongoose");

// schema setup
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model("User", userSchema);