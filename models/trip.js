const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const tripSchema = new Schema({
    place : {
        type : String,
        required:true
    },
    date : {
        type : Date,
    },
    fullItinerary : {
        type : JSON
    }
})

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;