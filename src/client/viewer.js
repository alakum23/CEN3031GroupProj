/**
 * This file will run once the index.html page is loaded in the browser.
 * Think of it as the C++ 'main' function.
 */

//This if statement is needed to enable hot module reloading on the development build
if (module.hot) {
	module.hot.accept(); // eslint-disable-line no-undef
}

// Import some Cesium assets (functions, classes, etc)
import { Ion, Viewer, createWorldTerrain, createOsmBuildings, Cartesian3, Math, Cartographic, ScreenSpaceEventType, BillboardCollection, EntityCollection, HeadingPitchRange } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import Billboard from "cesium/Source/Scene/Billboard";

// Import custom assets (functions, classes, etc)
import "./css/viewer.css";  // Incluse the page's CSS functions here
import logMessage from "./js/customLog"; // Example custom function import
import generateDisasterPins from "./js/generateDisasterPins";
import "./js/htmlFuncs";  // Include the functions used by the HTML UI elements here

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer('cesiumContainer', {
	sceneModePicker: false,
	terrainProvider: createWorldTerrain() // Give terrain data to viewer (for example see Yosemite Valley, CA, USA)
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
viewer.scene.primitives.add(createOsmBuildings());   

// Turn this depth test off to help the disaster pins display correctly.
viewer.scene.globe.depthTestAgainstTerrain = false;


// Make a request for wildfire data

let req = fetch("http://localhost:8080/NASA/disasters", {
	method: 'POST',
    json: true,
    body:  JSON.stringify({
      categories: ["wildfires"]
    })
});
req.then(value =>  value.json().then(data =>  {
    console.log(data);

	// Make an array of pins for representing disasters (will eventually become HTML button function too)
	generateDisasterPins(data.events).then((entities) =>  {
		entities.forEach((entity) =>  { 
			viewer.entities.add(entity);
		});
	});
}));

	




// Setup mouse click action to make things in viewer clickable
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement)  {
	const pickedFeature = viewer.scene.pick(movement.position);
	
	// Anything from Cesium left clicking that we want to happen we can put here...
	if (pickedFeature /*&& pickedFeature.collection === disasterPinsCollection*/)  {
		// Below object has lat lon position (in radians)
		// x: longitude, y: latitude, z: height
		const positionCartographic = Cartographic.fromCartesian(pickedFeature.primitive.position);
		
		//console.log(positionCartographic);

		console.log(pickedFeature);
		viewer.flyTo(pickedFeature.id);
	}

}, ScreenSpaceEventType.LEFT_CLICK);


// Test the custom function I imported
logMessage("Viewer setup with building data!");

// Test making an api call to the backend express app


/*
 Sample for how to import an image file for use in js
 Uncomment this code and have a div with ID 'HiThere' in the viewer.html to see this in action.
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

//Start of JAVASCRIPT Code
function searchDate(){
  console.log("entered");
  // let input = document.getElementByID('search-date').value;
  var input = document.getElementById('search-date').value;
  console.log(input);
  alert("hey");
  
}

async function searchLocation(){
  console.log("entered");
  // let input = document.getElementByID('search-date').value;
  var input = document.getElementById('search-location').value;
  console.log(input);
  //sample fetch request, must post 
  await fetch('http://localhost:8080/api/test')
  .then((response) => response.json())
  .then((data) => console.log(data));
}

function searchDisaster(){
  console.log("entered");
  // let input = document.getElementByID('search-date').value;
  var input = document.getElementById('search-disaster').value;
  console.log(input);
}
let req2 = fetch("http://localhost:8080/api/test");
req2.then(response => console.log(response));

// Sample request for disaster data
fetch(`http://localhost:` + 8080 + `/NASA/disasters`, {
    method: 'POST',
    json: true,
    body:  JSON.stringify({
      categories: ["wildfires", "earthquakes"]
    })
}).then(value =>  value.json().then(data =>  {
    console.log(data);
}));
