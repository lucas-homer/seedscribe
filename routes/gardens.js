const express = require("express");
const router = express.Router();
const Garden = require("../models/garden");
const middleware = require("../middleware");

// INDEX
router.get("/", (req, res) => {
    Garden.find({}, (err, allGardens) => {
        if(err){
            console.log(err);
        } else{
            res.render("gardens/index", {gardens: allGardens})
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newGarden = {
        name: name,
        description: description,
        author: author
    };
    // create new garden and save to DB
    Garden.create(newGarden, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else{
            console.log(newlyCreated);
            req.flash("success", "Garden created!");
            res.redirect("/gardens");
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("gardens/new");
});

// SHOW
router.get("/:id", (req, res) => {
    // find garden with provided id
    // render show template with that garden
    Garden.findById(req.params.id).populate("plants").exec((err, foundGarden) => {
        if(err){
            console.log(err);
        } else{
            console.log(foundGarden);
            res.render("gardens/show", {garden: foundGarden});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkGardenOwnership, (req, res) => {
    Garden.findById(req.params.id, (err, foundGarden) => {
        res.render("gardens/edit", {garden: foundGarden});
    });
});

// UPDATE
router.put("/:id", middleware.checkGardenOwnership, (req, res) => {
    // find and update the correct garden
    // redirect to the show page
    Garden.findByIdAndUpdate(req.params.id, req.body.garden, (err, updatedGarden) => {
        if(err){
            res.redirect("/gardens");
        } else{
            req.flash("success", "Garden edited");
            console.log(updatedGarden);
            res.redirect("/gardens/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkGardenOwnership, (req, res) => {
    Garden.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/gardens");
        } else{
            req.flash("success", "Garden deleted");
            res.redirect("/gardens");
        }
    });
});

module.exports = router;