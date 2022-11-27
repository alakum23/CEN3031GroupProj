# HazardVis

This is HazardVis.

## Setup

Clone the repository, then run the following commands from the root directory to build and run HazardVis in development mode. </br>
Make sure that you have Node JS version 16.17.0 or higher and NPM version 8.15.0 or higher. </br>

**IMPORTANT: You need to create an .env file in the root of the project and ensure it is never pushed to the github repo** </br>

Use the file sample.env as a guide for including your NASA API KEY. Don't put spaces or quotes around the NASA API KEY. </br>

```
npm install 
npm run startDev 
```

Then open http://localhost:8080 to view the built application. </br>

## Commands

<code>npm run lint</code> - runs ESlint on the front and backend directories </br>
<code>npm run e2e</code> - runs END TO END testing files on the current client build using a backend production server </br>
<code>npm run test</code> - run the UNIT testing files using Jest </br>
<code>npm run coverage</code> - runs ALL testing files and creates a coverage report </br>
<code>npm run removeCoverage</code> - removes the directory created by the "npm run coverage" command </br>
<code>npm run removeDist</code> - removes the webpack built 'dist' folder (and the most recent build) </br>
<code>npm run removeNodeModules</code> - removes the node_modules directory (you will need to redownload the packages to build the project) </br>
<code>npm run buildDev</code> - creates a development build of your client src code and unit tests into the 'dist' folder </br>
<code>npm run buildProd</code> - creates a production build of your client src code and unit tests into the 'dist' folder </br>
<code>npm run startDev</code> - rebuilds the client in development mode and runs the express server in development mode </br>
<code>npm run startProd</code> - rebuilds the client in production mode and runs the express server in production mode </br>

## Project Structure

This project follows the client server model. It is composed of a client (frontend) and a server (backend). </br>

All source code is within the `src` directory. All unit tests are within the `test` directory. Webpack configuration files are in the `webpack` directory. </br>

### Client

The client is a website that uses HTML, CSS, JS, and the Cesium library. It is built using webpack. The backend then serves the build that webpack created. </br>

When built in development mode, the client has hot module reloading enabled. This means that changes made to the client source code will be rebuilt by webpack automatically while the backend server is running. Note that unit tests and backend changes are not tracked by hot module reloading. </br>

#### Adding A New HTML Page

To add a new html page to your application, do the following:
 - Modify `webpack.common.js` and add the html page name to the array of page names at the top of the document
 - Create a js file with the same name as the page name you added to the array (ex 'viewer' -> viewer.js) within the `src/frontend` folder
 - Optionally enable hot module reloading by adding `if (module.hot) { module.hot.accept(); }` to the js file you created
 - Create a html file with the same name as the page name you added to the array within the `src/frontend/html` folder
 - Add a route to your express server that will send the new html page to the client

### Backend

The backend is a NODE JS express server. It can be run in development or production mode. By default the server runs in production mode. </br>

Running in development mode enables hot module reloading (which is outlined above). </br>

Currently the `server.js` file holds all setup and implementation of the express server, and the `router.js` file holds the express routes that are used. View those files for more information about how they work. `multiply.js` is used to demonstrate how backend unit testing should be done. </br> 

## ESLint Configuration

This project uses ESLint with babel parser to help maintain good coding practices. </br>
ESlint has different configuration options for the front and backend directories, as well as the unit testing files. </br>
All configuration options are located within the `.eslintrc.json` file. Each set of linting options (the backend, frontend, and tests) are stored as a separate override within this file. To modify only one of those edit the specific override. To edit all simultaniously add attributes outside the override.</br>
There is also an eslint configuration unique to the end to end test file. </br>

## Jest Unit Testing Configuration

This project uses Jest with babel parser to unit test JavaScript code. </br>
Jest has different configurations for the front and backend of this project. </br>
Jest unit tests are stored in the `tests/*` directory. They are broken up into frontend and backend tests and I provided a sample for each. </br>
The configuration options are located within the `jest.config.js` file. </br>

</br>

**IMPORTANT: UNIT TESTS ARE NO LONGER GENERATED FOR THE CLIENT BUNDLES!** </br>

View this information for getting started with jest. https://jestjs.io/docs/getting-started </br>

### Adding new unit tests

Create a new file in the appropriate directory with a name following the `*.test.js` name convention. </br>
Import the functions you wish to test from the `src` directory. Then add your JEST unit tests in this file. </br>
Then use `npm run test` or `npm run coverage` to run the test. </br>

## Jest & Puppeteer Unit Testing Configuration

This project uses Jest and Puppeteer to run end to end testing. This allows us to test UI interactions and functionality within a browser. </br>

Running the end to end tests requires having a build of the client! </br>

The end to end tests are held within the `./test/end_to_end.test.js` file. It uses jest hooks to start and stop the express server at the appropriate times, 
and puppeteer to control and manage the browser and browser simulated interactions. </br>

View this information for getting started with puppeteer. https://developer.chrome.com/docs/puppeteer/get-started/ </br>

### Adding new End To End tests

Review the information on how to write a unit test with jest / puppeteer before attempting to write end to end tests. </br>
Also note that much of the puppeteer setup (such as launching puppeteer and making a new webpage for each test) is done for you. </br>
View the current tests in the `./test/end_to_end.test.js` file for some example tests. </br>
