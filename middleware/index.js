const Garden = require("../models/garden");
const Plant = require("../models/plant");
const Note = require("../models/note");

// create middleware object
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
}

middlewareObj.checkGardenOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Garden.findById(req.params.id, (err, foundGarden) => {
            if(err) {
                req.flash("error", "Garden not found");
                res.redirect("back");
            } else {
                // does user own the garden?
                if(foundGarden.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // otherwise redirect
                    req.flash("error", "You do not have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkPlantOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Plant.findById(req.params.plant_id, (err, foundPlant) => {
            if(err) {
                res.redirect("back");
            } else {
                // does user own the plant?
                if(foundPlant.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // otherwise redirect
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkNoteOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Note.findById(req.params.note_id, (err, foundNote) => {
            if(err) {
                res.redirect("back");
            } else {
                // does user own the note?
                if(foundNote.author.id.equals(req.user._id)) {
                    next();
                } else {
                    //otherwise redirect
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logge din to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;