const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// root route
router.get("/", (req, res) => {
    res.render("landing");
});

// AUTH ROUTES

// show register form
router.get("/register", (req, res) => {
    res.render("register");
});

// handle register form and create new user
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to SeedScribe, " + user.username + "!");
            res.redirect("/gardens");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// handle login form and login user
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/gardens",
        failureRedirect: "/login"
    }), (req, res) => {
});

// logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have been logged out");
    res.redirect("/gardens");
});


module.exports = router;