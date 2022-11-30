/**
 * Sample functions to demo JS functions for use in the *.html ui here
 */

import Rectangle from "cesium/Source/Core/Rectangle";
import { getSelector } from "./selectRegion.js"

window.buttonClicked = function()  {
    console.log("A button was clicked");
}

window.getFromSearch = async function()  {
    // Get info from the UI parts
    const dateInput = document.getElementById('search-date').value;

    // Get coords from bbox
    const toDegrees = (radians) => radians * 180 / Math.PI;
    const bbox = getSelector().rectangle.coordinates._value;
    const northwest = Rectangle.northwest(bbox);
	const southeast = Rectangle.southeast(bbox);
    const boundaryBoxCoord = toDegrees(northwest.longitude) + "," + toDegrees(northwest.latitude) + "," + toDegrees(southeast.longitude) + "," + toDegrees(southeast.latitude);

    // Get the disaster name
    const disasterInput = document.getElementById('search-disaster').value;


    console.log(dateInput);
    console.log(boundaryBoxCoord);
    console.log(disasterInput);

    // Make the POST request options
    const options = {
        method: 'POST',
        json: true, 
        body: JSON.stringify({
            "start": dateInput,
            "end": dateInput,
            "bbox": boundaryBoxCoord
        })
    };

    // Get the new disaster data
    fetch('http://localhost:8080/NASA/disasters', options)
        .then(value =>  value.json())
        .then(data =>  {
            console.log(data)
        });
   
}
