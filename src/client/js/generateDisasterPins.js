// Import dependencies for this function
import { PinBuilder, Cartesian3, Math, VerticalOrigin, HeightReference, NearFarScalar, Color, Billboard } from "cesium";
import * as wildfireImg from "../img/wildfirePinImg.png"
import * as earthquakeImg from "../img/earthquakePinImg.png"
import * as volcanoImg from "../img/volcanoPinImg.png"
import * as stormImg from "../img/severe_stormPinImg.png"
import * as floodImg from "../img/floodPinImg.png"
import * as landslideImg from "../img/landslidePinImg.png"
import * as snowImg from "../img/snowPinImg.png"
import * as temperatureImg from "../img/temperaturePinImg.png"
import * as icebergImg from "../img/icebergPinImg.png"
import * as manmadeImg from "../img/manmadePinImg.png"
import * as watercolorImg from "../img/watercolorPinImg.png"
import * as droughtImg from "../img/droughtPinImg.png"
import * as dustStormImg from "../img/dustStormPinImg.png"

//<a href="https://www.flaticon.com/free-icons/earthquake" title="earthquake icons">Earthquake icons created by Freepik - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/earthquake" title="earthquake icons">Earthquake icons created by Freepik - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/volcano" title="volcano icons">Volcano icons created by GOWI - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/wildfire" title="wildfire icons">Wildfire icons created by Freepik - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/forest-fire" title="forest fire icons">Forest fire icons created by Freepik - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/tornado" title="tornado icons">Tornado icons created by Freepik - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/cyclone" title="cyclone icons">Cyclone icons created by Karacis - Flaticon</a>


/**
 * 
 * @param {Object[]} disasterData an array of the options needed to create the pins for the disasters
 */
const generateDisasterPins = async (disasterData) =>  {
    // Check if we have no data
    if (!Array.isArray(disasterData))  { return []; }
    if (disasterData.length === 0)  { return []; }
    
    // Define some constants
    const entities = [];

    // Create Pin Images for each disaster type
    const pinBuilder  = new PinBuilder();
    const pinArray = [];
    const pinImages = {
        "drought": await pinBuilder.fromUrl(droughtImg.default, Color.YELLOW, 80),
        "dustHaze": await pinBuilder.fromUrl(dustStormImg.default, Color.RED, 80),
        "earthquakes": await pinBuilder.fromUrl(earthquakeImg.default, Color.BROWN, 80),
        "floods": await pinBuilder.fromUrl(floodImg.default, Color.LIGHTBLUE, 80),
        "landslides": await pinBuilder.fromUrl(landslideImg.default, Color.GREEN, 80),
        "manmade": await pinBuilder.fromUrl(manmadeImg.default, Color.GHOSTWHITE, 80),
        "seaLakeIce": await pinBuilder.fromUrl(icebergImg.default, Color.LIGHTSEAGREEN, 80),
        "severeStorms": await pinBuilder.fromUrl(stormImg.default, Color.DARKBLUE, 80),
        "snow": await pinBuilder.fromUrl(snowImg.default, Color.WHITESMOKE, 80),
        "tempExtremes": await pinBuilder.fromUrl(temperatureImg.default, Color.ROSYBROWN, 80),
        "volcanoes": await pinBuilder.fromUrl(volcanoImg.default, Color.RED, 80),
        "waterColor": await pinBuilder.fromUrl(watercolorImg.default, Color.BLUE, 80),
        "wildfires": await pinBuilder.fromUrl(wildfireImg.default, Color.RED, 80)
    };
    
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
                image: (pinImages[disasterData[i].categories[0].id]).toDataURL(),
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