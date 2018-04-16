const express = require("express");
const router = express.Router({mergeParams: true});
const Garden = require("../models/garden");
const Plant = require("../models/plant");
const Note = require("../models/note");
const middleware = require("../middleware");

// NEW
router.get("/new", middleware.checkPlantOwnership, (req, res) => {
    // find plant by plant_id
    Plant.findById(req.params.plant_id, (err, foundPlant) => {
        if(err){
            console.log(err);
        } else{
            res.render("notes/new", {plant: foundPlant, garden_id: req.params.id});
        }
    });
});

// CREATE
router.post("/", middleware.checkPlantOwnership, (req, res) => {
    // lookup plant by plant_id
    Plant.findById(req.params.plant_id, (err, plant) => {
        if(err){
            console.log(err);
        } else{
            let garden_id = req.params.id;
            //create new note
            Note.create(req.body.note, (err, note) => {
                if(err){
                    //req.flash("error", "Something went wrong");
                    console.log(err);
                } else{
                    //add username and id to note
                    note.author.id = req.user._id;
                    note.author.username = req.user.username;

                    note.save();
                    plant.notes.push(note);
                    plant.save();
                    
                    console.log(plant);
                    
                    req.flash("success", "Successfully added note");
                    res.redirect("/gardens/" + garden_id + "/plants/" + plant._id);
                }
            });
        }
    });
});

// EDIT
router.get("/:note_id/edit", middleware.checkNoteOwnership, (req, res) => {
    Note.findById(req.params.note_id, (err, foundNote) => {
        if(err){
            res.redirect("back")
        } else{
            res.render("notes/edit", {garden_id: req.params.id, plant_id: req.params.plant_id, note: foundNote});
        }
    });
});

// UPDATE
router.put("/:note_id", middleware.checkNoteOwnership, (req, res) => {
    Note.findByIdAndUpdate(req.params.note_id, req.body.note, (err, updatedNote) => {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Note edited");
            res.redirect("/gardens/" + req.params.id + "/plants/" + req.params.plant_id);
        }
    });
});

// DESTROY
router.delete("/:note_id", middleware.checkNoteOwnership, (req, res) => {
    Note.findByIdAndRemove(req.params.note_id, (err) => {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Note deleted");
            res.redirect("/gardens/" + req.params.id + "/plants/" + req.params.plant_id);
        }
    });
});

module.exports = router;