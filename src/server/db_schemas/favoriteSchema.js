/**
 * 2nd file to make a mongoose schema for adding a record type of 
 * favorite filters, locatiosn and dates to the MongoDB
 */

// Import mongoose 
const mongoose = require("mongoose");

// Create the schema in an object as shown below
const favoritesSchema = new mongoose.Schema({
    // each field is a JSON string
    // Look at the mongoose.Schema docs for more on how to do this
    // https://mongoosejs.com/docs/guide.html 

    location: String,
    startDate: String,
    endDate: String,
    disasterType: [String],
    userId: String
    
});

// Export the schema with an appropriate name as a mongoose model. 
module.exports = mongoose.model("favoriteFilters", favoritesSchema);
