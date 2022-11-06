// Import dependencies for this function
import { PinBuilder, Cartesian3, Math, VerticalOrigin, HeightReference, NearFarScalar, Color } from "cesium";
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
    const billboards = [];

    // Create Pin Images for each disaster type
    const wildFirePin = await pinBuilder.fromUrl(wildfireImg.default, Color.RED, 80);

    // Add the billboard options to the array for each disaster
    for (let i = 0; i < 200; i++)  {
        const billboard = {
            id: "Disaster Pin",
            position: Cartesian3.fromDegrees(Math.randomBetween(-180, 180), Math.randomBetween(-90, 90)),
            image: wildFirePin.toDataURL(),
            verticalOrigin: VerticalOrigin.BOTTOM,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            scaleByDistance: new NearFarScalar(1.5e2, 1.25, 8.0e7, 0.1), // Set scale to change with distance so pins are more readable far away
        };
        billboards.push(billboard);
    }

    // Return the created billboard collection
    return billboards;
}

export default generateDisasterPins;