//Node JS package imports 
const path = require('path');   // For common operations with file paths
const express = require('express'); // For setting up the router
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // For requests to NASA
require('dotenv').config(); // For reading needed info from .env for NASA connection
const { check, validationResult } = require('express-validator');

// Database Schema Imports
const Student = require("./db_schemas/studentSchema"); // Get the student schema 
const favoriteFilters = require("./db_schemas/favoriteSchema");

// Creating express router
const router = express.Router();
router.use(express.json({limit: '1mb', type: `*/*`}));
const BUILD_DIR = path.join(__dirname, '../../dist');

//------------------------------WEBPAGE ROUTES------------------------------//

// Define all the application routes here
router.get('/viewer', [], (req, res) =>  {
    res.sendFile(path.join(BUILD_DIR, './viewer.html'))
});

//Specify api routes (server routes that don't server HTML files but still return information)
router.get('/api/test', [], async (req, res) =>  {
    res.send({body: "Hello"});
});

//------------------------------MONGO DB DATABASE ROUTES------------------------------//

//new route for favorite filter
//getting a user fav filter, and 1 for adding a new filter
router.put('/mongoose/filters/add', [
    //add===validation
    check('location').optional().isString().withMessage('Location must be a valid location'),
    check('startDate').optional().trim().isDate().withMessage('start date must be a valid date'),
    check('endDate').optional().trim().isDate().withMessage('end date must be a valid date'),
    check('disasterType').optional().isString().withMessage('disasters must be real disasters'),
    check('userId').optional().isNumeric().withMessage('user id must be a valid id'),

], async(req, res) => {
    const filter = new favoriteFilters({
        location: req.body.locaiton,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        disasterType: req.body.disasterType,
        userId: req.body.userID,
    });

    try  {
        // Call to save the student to the database
        let result = await filter.save();

        // Return Success Message
        res.send({msg: "Added One Filter"});
    } catch (error)  {
        // Handle Errors that could be thrown by the await
        console.log(error);
        res.send({msg: "Could Not Add Filter"});
    }
})

//  Sample route for adding info to mongoose
router.get('/mongoose/test/add', [], async (req, res) => {
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
router.get('/mongoose/test/find', [], async (req, res) => {
    let query = await Student.find({}); // Get all records in database
    // You should do error handling and stuff here...
    console.log(query);
    res.send(query);
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
    res.redirect('/viewer');
});

// Exporting router
module.exports = router;
