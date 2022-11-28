//Node JS package imports 
const path = require('path');   // For common operations with file paths
const express = require('express'); // For setting up the router
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // For requests to NASA
require('dotenv').config(); // For reading needed info from .env for NASA connection

// Database Schema Imports
const Student = require("./db/studentSchema"); // Get the student schema 

// Creating express router
const router = express.Router();
router.use(express.json({limit: '1mb', type: `*/*`}));
const BUILD_DIR = path.join(__dirname, '../../dist');

// Define all the application routes here
router.get('/viewer', (req, res) =>  {
    res.sendFile(path.join(BUILD_DIR, './viewer.html'))
});

//Specify api routes (server routes that don't server HTML files but still return information)
router.get('/api/test', async (req, res) =>  {
    res.send({body: "Hello"});
});

// Let's add a student as a test (occurs every time we start the server)
// Below is a sample of how to add a student to the database

//  Sample route for adding info to mongoose
router.get('/mongoose/test/add', async (req, res) => {
    // Define a new student object to add
    const stud = new Student({
        roll_no: 1001,
        name: 'Madison Hyde',
        year: 3,
        subjects: ['DBMS', 'OS', 'Graph Theory', 'Internet Programming']
    });

    try  {
        // Call to save the student to the database
        let result = await stud.save();

        // Return Success Message
        res.send("Added One Student");
    } catch (error)  {
        // Handle Errors that could be thrown by the await
        console.log(error);
        res.send("Could Not Add Student");
    }
});

//  Sample route for getting info from Mongoose
router.get('/mongoose/test/find', async (req, res) => {
    let query = await Student.find({}); // Get all records in database
    // You should do error handling and stuff here...
    console.log(query);
    res.send(query);
});


router.post('/NASA/disasters', async (req, res) =>  {
    const params = new URLSearchParams({
        api_key: process.env.NASA_API_KEY,
        status: req.body.status || "all"
    });

    // Append filter params if they exist
    if (req.body.categories !== undefined)  { params.append("category", req.body.categories.toString()); }
    if (req.body.start !== undefined)  { params.append("start", req.body.pastDataStart); }
    if (req.body.end !== undefined)  { params.append("end", req.body.pastDataEnd); }    
    if (req.body.boundaryBox !== undefined)  { params.append("bbox", req.body.boundaryBox); }

    // Log the params
    console.log(params.toString());

    // Make the request
    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?` + params.toString(), {
        method: "GET", 
        json: true, 
        status: 'open'
    });

    const data = await response.json();
    res.send(data);
});

router.get('/NASA/all-disasters', async (req, res) => {
    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?api_key=` + process.env.NASA_API_KEY, {
        method: "GET", 
        json: true, 
        status: 'open'
    });

    const data = await response.json();
    res.send(data);
});

//Specify the default webpage last!
router.get('*', (req, res) =>  {
    res.redirect('/viewer');
});

// Exporting router
module.exports = router;
