/**
 * Server backend file using express.js
 * Serves the latest webpack build of the frontend directory
 * 
 * figure out which data we will need and not need. 
 *      - latitude
 *      - longitude
 *      - title
 *      - category
 * look into getting old disaster data (from past days)
 * caching requests
*/

// Determine development or production server
require('dotenv').config();
const ENVIRONMENT = process.argv[2] || 'production';

// List server imports
const path = require('path');
const express= require('express');
const router = require('./router.js');

// Setup the express app and some useful constants
const APP = express();
APP.disable("x-powered-by");
const BUILD_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 8080;

// Setup webpack hot module reloading on a development server
if (ENVIRONMENT === 'development')  {
    const webpack = require('webpack');
    const webpackconfig = require('../../webpack/webpack.dev.js');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    // Allow express to use webpack hot module reloading
    const compiler = webpack(webpackconfig);
    const middleware = webpackMiddleware(compiler, { });
    APP.use(middleware);
    APP.use(webpackHotMiddleware(compiler));
}

// Allow the static folder (with all the .bundle.js files and images etc.) to be served by this server
APP.use('/static', express.static(path.join(BUILD_DIR, '/static')));

// Allow the app to use the routes we defined in the router.js file
APP.use('/', router);

// Start the server if running the code with node command, else export our app
if( require.main === module )  {
    // Make server listen
    APP.listen(PORT, () => {
        console.log(`Server is in ${ENVIRONMENT} mode listening @ http://localhost:${PORT}`);
        console.log(`Serving build from: ${BUILD_DIR}`);
        console.log('Press Ctrl+C to quit.');
    });
} else  {
    module.exports = APP;
}
