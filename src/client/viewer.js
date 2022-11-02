/**
 * This file will run once the index.html page is loaded in the browser.
 * Think of it as the C++ 'main' function.
 */

//This if statement is needed to enable hot module reloading on the development build
if (module.hot) {
	module.hot.accept(); // eslint-disable-line no-undef
}

// Import some Cesium assets (functions, classes, etc)
import { Ion, Viewer, BillboardCollection, createWorldTerrain, createOsmBuildings, Cartesian3, Math, PinBuilder, Color, VerticalOrigin, HeightReference} from "cesium";
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

// Cesium provided class for making pin icons
const pinBuilder = new PinBuilder();

// Create a wildfire pin on the map
import * as wildfireImg from "./img/Wildfire.png";
const wildfirePin = Promise.resolve(
  pinBuilder.fromUrl(wildfireImg.default, Color.RED, 80)
).then(function (canvas) {
  return viewer.entities.add({
    name: "Wildfire Pin",
    position: Cartesian3.fromDegrees(-75.1705217, 39.921786),
    billboard: {
      image: canvas.toDataURL(),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
    }
  });
});

// Create a flooding pin on the map
import * as floodingImg from "./img/Comp-Sci-Img.jpg";
const floodingPin = Promise.resolve(
  pinBuilder.fromUrl(floodingImg.default, Color.ROYALBLUE, 80)
).then(function (canvas) {
  return viewer.entities.add({
    name: "Wildfire Pin",
    position: Cartesian3.fromDegrees(-75.1705217, 40.921786),
    billboard: {
      image: canvas.toDataURL(),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
    },
  });
});

// Create an earthquake pin on the map
import * as earthquakeImg from "./img/Comp-Sci-Img.jpg";
const earthquakePin = Promise.resolve(
  pinBuilder.fromUrl(earthquakeImg.default, Color.ROSYBROWN, 80)
).then(function (canvas) {
  return viewer.entities.add({
    name: "Wildfire Pin",
    position: Cartesian3.fromDegrees(-75.1705217, 45.921786),
    billboard: {
      image: canvas.toDataURL(),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
    },
  });
});

// Make an array of pins
let billboards = new BillboardCollection({ scene: viewer.scene});
const pinsArray = [];
for (let i = 0; i < 200; i++)  {
  pinsArray[i] = pinBuilder.fromUrl(wildfireImg.default, Color.RED, 80);
}
Promise.all(pinsArray).then(function (pins)  {
  pins.forEach(element => {
    console.log(element);
    return billboards.add({
      id: "Wildfire Pin",
      position: Cartesian3.fromDegrees(Math.randomBetween(-180, 180), Math.randomBetween(-90, 90)),
      image: element.toDataURL(),
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      // Look into aligned axis and some math to fix visual bug?
    });
  });
});
viewer.scene.primitives.add(billboards);

// Test the custom function I imported
logMessage("Viewer setup with building data!");

// Test making an api call to the backend express app
let req = fetch("http://localhost:8080/api/test");
req.then(response => console.log(response));
