/**
 * This file will run once the index.html page is loaded in the browser.
 * Think of it as the C++ 'main' function.
 */

//This if statement is needed to enable hot module reloading on the development build
if (module.hot) {
	module.hot.accept(); // eslint-disable-line no-undef
}

// Import some Cesium assets (functions, classes, etc)
import { Rectangle, Ion, Viewer, ScreenSpaceEventHandler, createWorldTerrain, sampleTerrainMostDetailed, KeyboardEventModifier, createOsmBuildings, Color, Cartesian3, Cartographic, ScreenSpaceEventType, HeadingPitchRange } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Import custom assets (functions, classes, etc)
import "./css/viewer.css";  // Incluse the page's CSS functions here
import logMessage from "./js/customLog"; // Example custom function import
import generateDisasterPins from "./js/generateDisasterPins";
import "./js/htmlFuncs";  // Include the functions used by the HTML UI elements here
import { addSelectorToViewer, drawSelector, endDrawRegion, hideSelector, startDrawRegion } from "./js/selectRegion";

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
viewer.scene.globe.enableLighting = true;


// Make a request for disaster data
let req = fetch("http://localhost:8080/NASA/all-disasters", {
	method: 'GET',
    json: true,
}).then(value =>  value.json().then(data =>  {
    console.log(data);

	// Make an array of pins for representing disasters (will eventually become HTML button function too)
	generateDisasterPins(data.events).then((entities) =>  {
		entities.forEach((entity) =>  { 
			viewer.entities.add(entity);
		});
	});
}));

// filterRegion is a rectangle entity that user draws on globe
const filterRegion = addSelectorToViewer(viewer);

// Set the drawEventHandler actions 
const drawEventHandler = new ScreenSpaceEventHandler(viewer.canvas);
drawEventHandler.setInputAction(() => startDrawRegion(viewer), ScreenSpaceEventType.LEFT_DOWN, KeyboardEventModifier.SHIFT);
drawEventHandler.setInputAction((event) => drawSelector(viewer, event), ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
drawEventHandler.setInputAction(() =>  {
	endDrawRegion(viewer);

	// BELOW CODE GETS THE CORNERS FROM THE RECTANGLE AND QUERIES NASA FOR ALL EVENTS IN THAT REGION
	const rect = filterRegion.rectangle.coordinates._value;
	const northwest = Rectangle.northwest(rect);
	const southeast = Rectangle.southeast(rect);

	// Convert to degrees for NASA
	const toDegrees = (radians) => radians * 180 / Math.PI;

	const boundaryBoxCoord = toDegrees(northwest.longitude) + "," + 
						     toDegrees(northwest.latitude) + "," + 
						     toDegrees(southeast.longitude) + "," + 
						     toDegrees(southeast.latitude);

	// This is the sample of how to query nasa for a bounding box (only use await if you don't use .then())
	fetch("http://localhost:8080/NASA/disasters", {
		method: 'POST',
    	json: true,
    	body:  JSON.stringify({
			boundaryBox: boundaryBoxCoord,
			status: "open"
    	})
	}).then(value =>  value.json().then(data =>  {
    	console.log(data);
	}));

}, ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.SHIFT);
//Hide the selector by clicking anywhere
drawEventHandler.setInputAction(() => hideSelector(), ScreenSpaceEventType.LEFT_CLICK);


// Handle setup of the popup div for when pins are clicked
const popupDiv = document.getElementById("popup");
popupDiv.style.display = "none";

viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo)  {
  popupDiv.style.display = "none";
});

// Setup mouse click action to make things in viewer clickable
viewer.screenSpaceEventHandler.setInputAction(async function onLeftClick(movement)  {
	// Anything from Cesium left clicking that we want to happen we can put here...
	const pickedFeature = viewer.scene.pick(movement.position);

	if (pickedFeature)  {
		
		// Handle the pop up div information
		popupDiv.style.display = "block";
		popupDiv.innerText = "Name: " + pickedFeature.id._properties._disasterName._value + "\n Latitude: " + pickedFeature.id._properties._lat._value + "\n Longitude: " + pickedFeature.id._properties._lon._value;

		// Get the terrain based location of the entity we picked 
		const cartographicPos = Cartographic.fromCartesian(pickedFeature.primitive.position);
		const terrainLocation = await sampleTerrainMostDetailed(viewer.terrainProvider, [cartographicPos]);

		// Create a temporary entity to fly to (needed to prevent clipping into ground during flight)
		const tempEntity = viewer.entities.add({
			position: Cartesian3.fromRadians(terrainLocation[0].longitude, terrainLocation[0].latitude, terrainLocation[0].height),
			point : {
				pixelSize : 0,
				color : Color.TRANSPARENT,
				outlineColor : Color.TRANSPARENT,
				outlineWidth : 0
			},
		});

		// Fly to that temporary entity and then delete it
		viewer.flyTo(tempEntity, { 
			offset: new HeadingPitchRange(undefined, -Math.PI/6, 1000) 
		}).then(() => viewer.entities.remove(tempEntity));
	} else  {
		// No pin selected so hide the pop-up
		popupDiv.style.display = "none";
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
