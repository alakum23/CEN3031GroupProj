const path = require('path');
const express = require('express');
const { stringify } = require('querystring');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

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
