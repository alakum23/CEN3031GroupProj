/**
 * This file will run once the index.html page is loaded in the browser.
 * Think of it as the C++ 'main' function.
 */

//This if statement is needed to enable hot module reloading on the development build
if (module.hot) {
	module.hot.accept(); // eslint-disable-line no-undef
}

// Import some Cesium assets (functions, classes, etc)
import { Ion, Viewer, ScreenSpaceEventHandler, createWorldTerrain, KeyboardEventModifier, createOsmBuildings, Color, Cartesian3, Cartographic, ScreenSpaceEventType, HeadingPitchRange } from "cesium";
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





const filterRegion = addSelectorToViewer(viewer);

// Set the drawEventHandler actions 
const drawEventHandler = new ScreenSpaceEventHandler(viewer.canvas);
drawEventHandler.setInputAction(() => startDrawRegion(viewer), ScreenSpaceEventType.LEFT_DOWN, KeyboardEventModifier.SHIFT);
drawEventHandler.setInputAction((event) => drawSelector(viewer, event), ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
drawEventHandler.setInputAction(() => endDrawRegion(viewer), ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.SHIFT);
//Hide the selector by clicking anywhere
drawEventHandler.setInputAction(() => hideSelector(), ScreenSpaceEventType.LEFT_CLICK);

// To filter on that location we will simply check if the point lat/lons are within those of the rectangle coordinates 
// Using simple checks (west <= lon <= east --- south <= lat <= north)



// Setup mouse click action to make things in viewer clickable
viewer.screenSpaceEventHandler.setInputAction(async function onLeftClick(movement)  {
	// Anything from Cesium left clicking that we want to happen we can put here...

	const pickedFeature = viewer.scene.pick(movement.position);	
	if (pickedFeature)  {
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
	}

}, ScreenSpaceEventType.LEFT_CLICK);


// Test the custom function I imported
logMessage("Viewer setup with building data!");

// Test making an api call to the backend express app
let req2 = fetch("http://localhost:8080/api/test");
req2.then(response => console.log(response));
