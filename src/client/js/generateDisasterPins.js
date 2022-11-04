// Import dependencies for this function
import { PinBuilder, Cartesian3, Math, BillboardCollection, VerticalOrigin, HeightReference, NearFarScalar, Color } from "cesium";
import * as wildfireImg from "../img/Wildfire.png"


/**
 * 
 * @param {Cesium.Viewer} viewer 
 * @param {Object[]} disasterData 
 */
const generateDisasterPins = async (viewer, disasterData) =>  {
    //if ()  { return; }
    //if (disasterData.length === 0)  { return; }
    

    // Define some constants
    const pinBuilder = new PinBuilder();
    const billboards = new BillboardCollection( { scene: viewer.scene });
    const pinsArray = [];

    // Determine color & image based on disaster type
    for (let i = 0; i < 200; i++)  {
      pinsArray[i] = pinBuilder.fromUrl(wildfireImg.default, Color.RED, 80);
    }

    // Place at the correct disaster position, with and ID equal to the disaster name?
    Promise.all(pinsArray).then((pins) => {
      pins.forEach((element) => {
        return billboards.add({
          id: "Wildfire Pin",
          position: Cartesian3.fromDegrees(Math.randomBetween(-180, 180), Math.randomBetween(-90, 90)),
          image: element.toDataURL(),
          verticalOrigin: VerticalOrigin.BOTTOM,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          scaleByDistance: new NearFarScalar(1.5e2, 1.25, 8.0e7, 0.1), // Set scale to change with distance so pins are more readable far away
          // Look into aligned axis and some math to fix visual bug?
        });
      });
    });

    // Add the new set of billboards to the globe
    viewer.scene.primitives.add(billboards);
}

export default generateDisasterPins;