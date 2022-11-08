// Import dependencies for this function
import { PinBuilder, Cartesian3, Math, VerticalOrigin, HeightReference, NearFarScalar, Color, Billboard } from "cesium";
import * as wildfireImg from "../img/Wildfire.png"


/**
 * 
 * @param {Object[]} disasterData an array of the options needed to create the pins for the disasters
 */
const generateDisasterPins = async (disasterData) =>  {
    // Check if we have no data
    if (!Array.isArray(disasterData))  { return []; }
    if (disasterData.length === 0)  { return []; }
    
    // Define some constants
    const pinBuilder = new PinBuilder();
    const entities = [];

    // Create Pin Images for each disaster type
    const wildFirePin = await pinBuilder.fromUrl(wildfireImg.default, Color.RED, 80);
    
    // Add the billboard options to the array for each disaster
    for (let i = 0; i < disasterData.length; i++)  {
        const coords = disasterData[i].geometry[0].coordinates;
        const entity = {
            // ID and location
            id: "Disaster Pin: " + i,
            position: Cartesian3.fromDegrees(coords[0], coords[1]),
            heightReference: HeightReference.CLAMP_TO_GROUND,
            // Setup the billboard
            billboard: {
                image: wildFirePin.toDataURL(),
                verticalOrigin: VerticalOrigin.BOTTOM,
                heightReference: HeightReference.CLAMP_TO_GROUND,
                scaleByDistance: new NearFarScalar(1.5e2, 1.25, 8.0e7, 0.1), // Set scale to change with distance so pins are more readable far away
            },
            // Define our custom disaster data properties in this grab-bag
            properties:  {
                disasterName: disasterData[i].title, 
                lat: coords[0],
                lon: coords[1]
            },
        };
        entities.push(entity);
    }

    // Return the created billboard collection
    return entities;
}

export default generateDisasterPins;