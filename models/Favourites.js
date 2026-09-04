const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userName: { type: String, required: true }, // Jis user ne favorite kiya
    cityName: String,                           // Kis shehar ki jagah hai
    activityTitle: String,                      // Jagah ka naam ya activity
    description: String,                        // Activity ki details
    savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoriteSchema);