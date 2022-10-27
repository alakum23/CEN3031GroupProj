const path = require('path');
const express = require('express');

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

//Specify the default webpage last!
router.get('*', (req, res) =>  {
    res.redirect('/viewer');
});

// Exporting router
module.exports = router;
