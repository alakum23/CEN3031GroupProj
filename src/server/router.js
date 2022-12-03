//Node JS package imports 
const path = require('path');   // For common operations with file paths
const express = require('express'); // For setting up the router
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // For requests to NASA
require('dotenv').config(); // For reading needed info from .env for NASA connection
const { check, validationResult } = require('express-validator');

// Database Schema Imports
const User = require("./db_schemas/userSchema"); // Get the student schema 

// Creating express router
const router = express.Router();
router.use(express.json({limit: '1mb', type: `*/*`}));
const BUILD_DIR = path.join(__dirname, '../../dist');

//------------------------------WEBPAGE ROUTES------------------------------//

// Define all the application routes here
router.get('/login', [], (req, res) =>  {
    res.sendFile(path.join(BUILD_DIR, './login.html'))
});

router.get('/viewer', [], (req, res) =>  {
    res.sendFile(path.join(BUILD_DIR, './viewer.html'))
});

//Specify api routes (server routes that don't server HTML files but still return information)
router.get('/api/test', [], async (req, res) =>  {
    res.send({body: "Hello"});
});

//------------------------------MONGO DB DATABASE ROUTES------------------------------//

//  Sample route for adding info to mongoose
router.put('/mongoose/test/add', [], async (req, res) => {
    // Define a new user object to add
    const newUser = new User({
        username: 'group22', 
        password: 'g22pass',
        favLocation: ['Rainesville']
    });

    try  {
        // Call to save the user to the database
        let result = await newUser.save();

        // Return Success Message
        res.send("Added One User");
    } catch (error)  {
        // Handle Errors that could be thrown by the await
        console.log(error);
        res.send("Could Not Add User");
    }
});

//  Sample route for getting info from Mongoose
//we will use this for "sign in"
var sub;
router.put('/mongoose/test/find', [], async (req, res) => {
    let query = await User.find({
        username: req.body.user, password: req.body.pass
        //username, password
});
    // Get all records in database
    // You should do error handling and stuff here...
    //if query is not null, then allow login
    //response await
    //send response, read response, if blah blah then perform action
    res.send(query);
    // if(query!="[]")
    // {
    //     console.log("not null")
    //     res.send({body: "bad"});

    // }
    // else{
    //     console.log("null")
    //     res.send({body: "good"});

    // }
        
});

//------------------------------NASA DATASET ROUTES------------------------------//

/**
 * POST route that will get disaster data from NASA based on provided filters
 */
router.post('/NASA/disasters', [
    // Handle validation
    check('categories').optional().isArray({ min: 1, max: 13 }),
    check('categories.*').isString().isIn([
        'drought',
        'dustHaze',
        'earthquakes',
        'floods',
        'landslides',
        'manmade',
        'seaLakeIce',
        'severeStorms',
        'snow',
        'tempExtremes',
        'volcanoes',
        'waterColor',
        'wildfires'
    ]).withMessage('categories array values must be valid option'),
    check('start').optional().trim().isDate().withMessage('start must be a valid date'),
    check('end').optional().trim().isDate().withMessage('end must be a valid date'),
    check('boundaryBox').optional().isString().withMessage('boundaryBox should be a string with the two corners of the bounding box'),
    check('status').optional().isString().isIn(['open', 'closed', 'all']).withMessage('status should be open, closed, or all')
],  async (req, res) =>  {
    // Handle the validation error responses
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Do rest of logic
    const params = new URLSearchParams({
        api_key: process.env.NASA_API_KEY,
        status: req.body.status || "all"
    });

    // Append filter params if they exist
    if (req.body.categories !== undefined)  { params.append("category", req.body.categories.toString()); }
    if (req.body.start !== undefined)  { params.append("start", req.body.start); }
    if (req.body.end !== undefined)  { params.append("end", req.body.end); }    
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
    console.log(data);
    res.send(data);
});

/**
 * GET route that will get disaster data for the current day from NASA with no filters
 */
router.get('/NASA/all-disasters', [], async (req, res) => {
    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?api_key=` + process.env.NASA_API_KEY, {
        method: "GET", 
        json: true, 
        status: 'open'
    });

    const data = await response.json();
    res.send(data);
});

//------------------------------DEFAULT ROUTE------------------------------//

//Specify the default webpage last!
router.get('*', (req, res) =>  {
    res.redirect('/login');
});

// Exporting router
module.exports = router;
