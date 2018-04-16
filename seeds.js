const mongoose = require("mongoose");
const Garden = require("./models/garden");
const Plant = require("./models/plant");
//const Note = require("./models/note");
//const User = require("./models/user");

const data = [
    {
        name: "Front Yard",
        description: "garden in the front yard"
    },
    {
        name: "Back Yard",
        description: "garden in the back yard"
    },
    {
        name: "Green House",
        description: "Green House indoor garden"
    }
];



const seedDB = () => {
    Garden.remove({}, (err) => {
        if(err){
            console.log(err);
        } 
        console.log("removed gardens");
        Plant.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed plants");
            //add a few gardens
            data.forEach(function(seed){
                Garden.create(seed, function(err, garden){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a garden");
                        //create a plant
                        Plant.create(
                            {
                                plantName: "Cilantro"

                            }, function(err, plant){
                                if(err){
                                    console.log(err);
                                } else {
                                    garden.plants.push(plant);
                                    garden.save();
                                    console.log("created new plant");
                                }
                            });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;