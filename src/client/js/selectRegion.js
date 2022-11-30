import { CallbackProperty, Cartographic, Rectangle, Cartesian3, VerticalOrigin, HeightReference, NearFarScalar, Color, Billboard, ScreenSpaceEventHandler } from "cesium";
import Event from "cesium/Source/Core/Event";
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";

let selector;
let rectangleSelector = new Rectangle();
let cartesian = new Cartesian3();
let tempCartographic = new Cartographic();
let firstPoint = new Cartographic();
let firstPointSet = false;
let startedDrawing = false;

// Create the callback function for the rectangle coordinates
const getSelectorLocation = new CallbackProperty(function getSelectorLocation(time, result) {
	return Rectangle.clone(rectangleSelector, result);
}, false);

/**
 * 
 * @returns 
 */
const getSelector = () =>  selector;

/**
 * 
 * @param {Viewer} viewer 
 * @returns {Entity} The 'selector' entity that was added to the viewer
 */
const addSelectorToViewer = (viewer) =>  {
    selector = viewer.entities.add({
        selectable: false,
        show: false,
        rectangle: {
          coordinates: getSelectorLocation,
          material: Color.LIGHTSEAGREEN.withAlpha(0.5)
        }
    });
    return selector;
}

/**
 * Hides the draw region selector
 */
const hideSelector = () => selector.show = false;

/**
 * Function which starts the drawing routine
 * @param {Viewer} viewer the cesium viewer that the draw region selector is on 
 */
const startDrawRegion = (viewer) =>  {
    startedDrawing = true;
	selector.rectangle.coordinates = getSelectorLocation;
	viewer.scene.screenSpaceCameraController.enableLook = false;
}

/**
 * Function which handles the drawing routine
 * @param {Viewer} viewer the cesium viewer that the draw region selector is on 
 * @param {Event} movement an event from the ScreenSpaceEventHandler MOUSE_MOVE event
 */
const drawSelector = (viewer, movement) =>  {
	if (!startedDrawing) { return; }
	
	cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid, cartesian);
	
	if (cartesian)  {
		// Mouse cartographic position (rectangle needs that not the cartesian location)
		tempCartographic = Cartographic.fromCartesian(cartesian, viewer.scene.globe.ellipsoid);

	  	if (!firstPointSet)  {
			Cartographic.clone(tempCartographic, firstPoint);
			firstPointSet = true;
	  	} else  {
			// We order the points so the rectangle draws correctly
			rectangleSelector.east = Math.max(tempCartographic.longitude, firstPoint.longitude);
			rectangleSelector.west = Math.min(tempCartographic.longitude, firstPoint.longitude);
			rectangleSelector.north = Math.max(tempCartographic.latitude, firstPoint.latitude);
			rectangleSelector.south = Math.min(tempCartographic.latitude, firstPoint.latitude);
			selector.show = true;
		}
	}
}

/**
 * Function which ends the drawing routine
 * @param {Viewer} viewer the cesium viewer that the draw region selector is on 
 */
const endDrawRegion = (viewer) =>  {
    startedDrawing = false;
	firstPointSet = false;
	selector.rectangle.coordinates = rectangleSelector;
	viewer.scene.screenSpaceCameraController.enableLook = true;
}

export {startDrawRegion, drawSelector, endDrawRegion, addSelectorToViewer, hideSelector, getSelector};