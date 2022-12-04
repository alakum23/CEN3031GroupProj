/**
 * This file will run once the index.html page is loaded in the browser.
 * Think of it as the C++ 'main' function.
 */

//This if statement is needed to enable hot module reloading on the development build
if (module.hot) {
	module.hot.accept(); // eslint-disable-line no-undef
}

// Import some Cesium assets (functions, classes, etc)
import { Ion, Viewer, ScreenSpaceEventHandler, createWorldTerrain, sampleTerrainMostDetailed, createOsmBuildings, Color, Cartesian3, Cartographic, ScreenSpaceEventType, HeadingPitchRange } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Import custom assets (functions, classes, etc)
import "./css/viewer.css";  // Incluse the page's CSS functions here
import logMessage from "./js/customLog"; // Example custom function import
import {generateDisasterPins, setDisasterPinViewer} from "./js/generateDisasterPins";
import "./js/htmlFuncs";  // Include the functions used by the HTML UI elements here
import { addSelectorToViewer, drawSelector, endDrawRegion, startDrawRegion } from "./js/selectRegion";

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

// Setup disaster pin functions for viewer
setDisasterPinViewer(viewer);

// Make a request for disaster data
fetch("http://localhost:8080/NASA/all-disasters", {
	method: 'GET',
    json: true,
}).then(value =>  value.json()).then(data =>  {
	// Make an array of pins for representing disasters (will eventually become HTML button function too)
	generateDisasterPins(data.events).then(() =>  {
		console.log("ADDED");
	});
});

// filterRegion is a rectangle entity that user draws on globe
const filterRegion = addSelectorToViewer(viewer);

// Set the drawEventHandler actions 
const drawEventHandler = new ScreenSpaceEventHandler(viewer.canvas);
drawEventHandler.setInputAction(() => startDrawRegion(viewer), ScreenSpaceEventType.LEFT_DOWN);
drawEventHandler.setInputAction((event) => drawSelector(viewer, event), ScreenSpaceEventType.MOUSE_MOVE);
drawEventHandler.setInputAction(() =>  endDrawRegion(viewer), ScreenSpaceEventType.LEFT_UP);
//Hide the selector by clicking anywhere
//drawEventHandler.setInputAction(() => hideSelector(), ScreenSpaceEventType.LEFT_CLICK);


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
		popupDiv.innerText = "Name: " + pickedFeature.id._properties._disasterName._value + "\nLatitude: " + pickedFeature.id._properties._lat._value + "\nLongitude: " + pickedFeature.id._properties._lon._value + "\nBegan: " + pickedFeature.id._properties._date._value;

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

let req2 = fetch("http://localhost:8080/api/test");
req2.then(response => console.log(response));

fetch("http://localhost:8080/mongoose/filters/add", {
	method: 'PUT',
	json: true,
	body:  JSON.stringify({
		//PUT YOUR STUFF HERE
		location: "STRING",
		startDate: "STRING",
        endDate: "STRING",
        disasterType: ["STRING"],
        userId: "STRING",
	})
}).then(res => res.json()).then((data) => {
	console.log(data);
})
