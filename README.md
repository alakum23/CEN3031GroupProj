# HazardVis

## Setup

Clone the repository, then run the following commands from the root directory to build and run HazardVis in development mode. </br>
Make sure that you have Node JS version 16.17.0 or higher and NPM version 8.15.0 or higher. </br>

```
npm install 
npm run startDev 
```

Then open https://localhost:8080 to view the built application. </br>

## Commands

<code>npm run lint</code> - runs ESlint on the front and backend directories </br>
<code>npm run test</code> - run your testing files using Jest </br>
<code>npm run coverage</code> - runs your testing files and creates a coverage report </br>
<code>npm run removeCoverage</code> - removes the directory created by the "npm run coverage" command </br>
<code>npm run removeDist</code> - removes the webpack built 'dist' folder (and the most recent build) </br>
<code>npm run removeNodeModules</code> - removes the node_modules directory, best used for testing that all npm packages are included in the package.json file </br>
<code>npm run buildDev</code> - creates a development build of your frontend src code and unit tests into the 'dist' folder </br>
<code>npm run buildProd</code> - creates a production build of your frontend src code and unit tests into the 'dist' folder </br>
<code>npm run startDev</code> - rebuilds the frontend in development mode and runs the express server in development mode </br>
<code>npm run startProd</code> - rebuilds the frontend in production mode and runs the express server in production mode </br>

## Project Structure



### Client



### Backend



## ESLint Configuration

This project uses ESLint with babel parser to help maintain good coding practices. </br>
ESlint has different configuration options for the front and backend directories, as well as the unit testing files. </br>
All configuration options are located within the `.eslintrc.json` file. Each set of linting options (the backend, frontend, and tests) are stored as a separate override within this file. To modify only one of those edit the specific override. To edit all simultaniously add attributes outside the override.</br>

## Jest Unit Testing Configuration

This project uses Jest with abbel parser to unit test JavaScript code. </br>
Jest has different configurations for the front and backend of this project. </br>
Jest unit tests are stored in the `tests/*` directory. They are broken up into frontend and backend tests and I provided a sample for each. </br>
The configuration options are located within the `jest.config.js` file. </br>

</br>

**IMPORTANT: UNIT TESTS FOR THE BUILT FRONTEND ARE NOT RECOMPILED AUTOMATICALLY!**
You must run `npm run buildDev`, `npm run buildProd`, `npm run startDev`, or `npm run startProd` in order for webpack to rebuild the unit tests for the bundle. </br>

### Adding new unit tests

Create a new file in the appropriate directory with a name following the `*.test.js` name convention. </br>
Import the functions you wish to test from the `src` directory. Then add your JEST unit tests in this file. </br>
Then use `npm run test` or `npm run coverage` to run the test. </br>

## Adding A New HTML Page

To add a new html page to your application, do the following:
 - Modify `webpack.common.js` and add the html page name to the array of page names at the top of the document
 - Create a js file with the same name as the page name you added to the array (ex 'viewer' -> viewer.js) within the `src/frontend` folder
 - Optionally enable hot module reloading by adding `if (module.hot) { module.hot.accept(); }` to the js file you created
 - Create a html file with the same name as the page name you added to the array within the `src/frontend/html` folder
 - Add a route to your express server that will send the new html page to the client
