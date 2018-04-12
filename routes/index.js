const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// root route
router.get("/", (req, res) => {
    res.render("landing");
});



module.exports = router;