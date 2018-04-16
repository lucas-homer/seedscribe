const express = require("express");
const router = express.Router({mergeParams: true});
const Garden = require("../models/garden");
const Plant = require("../models/plant");
const middleware = require("../middleware");

// NEW
router.get("/new", middleware.checkGardenOwnership, (req, res) => {
    Garden.findById(req.params.id, (err, garden) => {
        if(err){
            console.log(err);
        } else{
            res.render("plants/new", {garden: garden});
        }
    });
});

// CREATE
router.post("/", middleware.checkGardenOwnership, (req, res) => {
    // lookup garden using id
    Garden.findById(req.params.id, (err, garden) => {
        if(err){
            console.log(err);
            res.redirect("/gardens");
        } else{
            // create new plant
            Plant.create(req.body.plant, (err, plant) => {
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else{
                    // add username and id to plant
                    plant.author.id = req.user._id;
                    plant.author.username = req.user.username;
                    // save plant
                    plant.save();
                    garden.plants.push(plant);
                    garden.save();
                    // redirect to garden show page
                    req.flash("success", "Successfully added plant!");
                    console.log(garden)
                    res.redirect("/gardens/" + garden._id);
                }
            });
        }
    });
});

// SHOW
router.get("/:plant_id", (req, res) => {
    Plant.findById(req.params.plant_id).populate("notes").exec((err, foundPlant) => {
        if(err){
            res.redirect("back");
        } else{
            res.render("plants/show", {plant: foundPlant, garden_id: req.params.id});
        }
    });
});

// EDIT
router.get("/:plant_id/edit", middleware.checkPlantOwnership, (req, res) => {
    Plant.findById(req.params.plant_id, (err, foundPlant) => {
        if(err){
            res.redirect("back");
        } else{
            res.render("plants/edit", {garden_id: req.params.id, plant: foundPlant});
        }
    });
});

// UPDATE
router.put("/:plant_id", middleware.checkPlantOwnership, (req, res) => {
    Plant.findByIdAndUpdate(req.params.plant_id, req.body.plant, (err, updatedPlant) => {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Plant edited");
            res.redirect("/gardens/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:plant_id", middleware.checkPlantOwnership, (req, res) => {
    Plant.findByIdAndRemove(req.params.plant_id, (err) => {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Plant deleted");
            res.redirect("/gardens/" + req.params.id);
        }
    }); 
});

module.exports = router;