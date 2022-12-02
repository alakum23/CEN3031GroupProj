/**
 * Sample file for how to make a mongoose schema for adding a record type to the MongoDB
 * Follow the instructions int this file in another file to create a new scheme for an object to 
 * insert into the database...
 */

// Import mongoose 
const mongoose = require("mongoose");

// Create the schema in an object as shown below
const studentSchema = new mongoose.Schema({
    // each field is a JSON string
    // Look at the mongoose.Schema docs for more on how to do this
    // https://mongoosejs.com/docs/guide.html 
    roll_no: Number, 
    name: String,
    year: Number,
    subjects: [String]
});

// Export the schema with an appropriate name as a mongoose model. 
module.exports = mongoose.model("Student", studentSchema);
