/**
 * An example of how to write JS functions in an external file
 * and export them to index.js so they can be used in other JS files.
 */

/**
 * 
 * @param {String} msg 
 */
const logMessage = (msg) => {console.log(msg);}

export default logMessage;
