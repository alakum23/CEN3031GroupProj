/**
 * Sample functions to demo JS functions for use in the *.html ui here
 */

import Rectangle from "cesium/Source/Core/Rectangle";
import { getSelector, hideSelector, toggleDrawing } from "./selectRegion.js"
import { generateDisasterPins } from "./generateDisasterPins.js";

window.buttonClicked = function()  {
    console.log("A button was clicked");
}

window.toggleNavbar = function()  {
    let UI = document.getElementById("navBar");
    if (UI.style.display === "none")  {
        UI.style.display = "block";
    } else  {
        UI.style.display = "none";
    }
}

window.startLocationSelection = function()  {
    let UI = document.getElementById("navBar");
    UI.style.display = "none";
    toggleDrawing();
}

window.clearLocationSelection = function()  {
    hideSelector();
}

window.getFromSearch = async function()  {
    // Get info from the UI parts
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    // Get coords from bbox
    let boundaryBoxCoord = undefined;
    if (getSelector().show === true)  {
        const bbox = getSelector().rectangle.coordinates._value;
        if (bbox !== undefined)  {
            const northwest = Rectangle.northwest(bbox);
            const southeast = Rectangle.southeast(bbox);
            const toDegrees = (radians) => radians * 180 / Math.PI;
            boundaryBoxCoord = toDegrees(northwest.longitude) + "," + toDegrees(northwest.latitude) + "," + toDegrees(southeast.longitude) + "," + toDegrees(southeast.latitude);    
        }
    }
    
    // Get the disaster types from the checkboxes
    let disasterCategories = [];
    ['drought', 'dustHaze', 'earthquakes', 'floods', 'landslides', 'severeStorms', 'snow', 'wildfires', 'volcanoes', 'tempExtremes', 'seaLakeIce', 'waterColor', 'manmade'].forEach((ID) =>  {
        if (document.getElementById(ID).checked)  {
            disasterCategories.push(ID);
        }
    });

    // Make the POST request body
    let bodyObj = {
        start: startDateInput,
        end: endDateInput
    };
    if (boundaryBoxCoord !== undefined)  { bodyObj["boundaryBox"] = boundaryBoxCoord; }
    if (disasterCategories.length > 0)  { bodyObj["categories"] = disasterCategories; }

    // Print our body to console (for debugging)
    console.log(bodyObj);

    // Get the new disaster data & add it to the viewer
    const response = await fetch('http://localhost:8080/NASA/disasters', {
        method: 'POST',
        json: true, 
        body: JSON.stringify(bodyObj)
    });
    const responseData = await response.json();

    // Print response in console and add pins to viewer
    console.log(responseData.events);
    await generateDisasterPins(responseData.events);
}
