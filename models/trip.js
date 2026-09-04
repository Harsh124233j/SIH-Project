const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({
    userName: { type: String, required: true }, // Jis user ne save kiya hai
    place: String,
    days: Number,
    month: String,
    budgetType: String,
    // Pura finalAns (JSON object) hum isme save karenge
    itineraryData: { type: mongoose.Schema.Types.Mixed },
    savedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Trip', tripSchema);