/**
 * This file will run once the index.html page is loaded in the browser.
 * Think of it as the C++ 'main' function.
 */

//This if statement is needed to enable hot module reloading on the development build
if (module.hot) {
	module.hot.accept(); // eslint-disable-line no-undef
}

// Import some Cesium assets (functions, classes, etc)
import { Ion, Viewer, createWorldTerrain, createOsmBuildings, Cartesian3, Math } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Import custom assets (functions, classes, etc)
import "./css/viewer.css";  // Incluse the page's CSS functions here
import logMessage from "./js/customLog"; // Example custom function import
import "./js/htmlFuncs";  // Include the functions used by the HTML UI elements here

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer('cesiumContainer', {
	terrainProvider: createWorldTerrain() // Give terrain data to viewer (for example see Yosemite Valley, CA, USA)
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
viewer.scene.primitives.add(createOsmBuildings());   

// Test the custom function I imported
logMessage("Viewer setup with building data!");

// Test making an api call to the backend express app
let req = fetch("http://localhost:8080/api/test");
req.then(response => console.log(response));


// Sample for how to import an image file for use in js
// Uncomment this code and have a div with ID 'HiThere' in the viewer.html to see this in action.
/*
import * as url from "./img/Comp-Sci-Img.jpg";  // Import's the image with the name 'url' for use in the JS file.
let img = document.createElement('img');
img.style = {
  height: '25%',
  width: '25'
};
img.src = url.default;
console.log('imported', url);
document.getElementById('HiThere').appendChild(img);
*/