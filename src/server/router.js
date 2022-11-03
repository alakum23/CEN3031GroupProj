const path = require('path');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Creating express router
const router = express.Router();
const BUILD_DIR = path.join(__dirname, '../../dist');

// Define all the application routes here
router.get('/viewer', (req, res) =>  {
    res.sendFile(path.join(BUILD_DIR, './viewer.html'))
});

//Specify api routes (server routes that don't server HTML files but still return information)
router.get('/api/test', (req, res) =>  {
    res.send({body: "Hello"});
});

router.get('/NASA/env', async (req, res) => {
    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?api_key=` + process.env.NASA_API_KEY, {
        method: "GET", 
        json: true, 
        status: 'open'
    });

    const data = await response.json();
    console.log(data);
    res.send(data);
});

//Specify the default webpage last!
router.get('*', (req, res) =>  {
    res.redirect('/viewer');
});

// Exporting router
module.exports = router;
