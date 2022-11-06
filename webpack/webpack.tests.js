// https://jdunkerley.co.uk/2017/06/03/how-to-set-up-webpack-based-typescript-electron-react-build-process-with-vsts-ci/
// Update other webpack configs with these functions...?
//

const path = require('path');
const fs = require('fs');

/**
 * 
 * @param {String} folder name of the folder to recursively read files from
 * @param {String} filter filter for which files to return
 * @returns an array of files that matched the filter and their locations
 */
const readDirRecursiveSync = (folder, filter) => {
  const currentPath = fs.readdirSync(folder).map(f => path.join(folder, f));
  const files = currentPath.filter(filter);
 
  const directories = currentPath
    .filter(f => fs.statSync(f).isDirectory())
    .map(f => readDirRecursiveSync(f, filter))
    .reduce((cur, next) => [...cur, ...next], []);
 
  return [...files, ...directories];
}

/**
 * 
 * @param {String} folder name of a folder to get all the test files from
 * @returns An object containing all the test file names and their locations
 */
const getEntries = (folder) =>
  readDirRecursiveSync(folder, f => f.match(/.*(test|spec)\.jsx?$/))
    .map((file) => {
      return {
        name: path.basename(file, path.extname(file)),
        path: path.resolve(file)
      }
    })
    .reduce((memo, file) => {
      memo[file.name] = file.path
      return memo
    }, {});

const testDirectory = path.resolve(__dirname, '../test/client/');
const entries = getEntries(testDirectory);

console.log(entries);

const entryPoint = {
  "testBundle.test" : Object.values(entries)
}

module.exports = env => {
	// Exporting a function so we can determine the mode to build tests in from command line arguments
	const webPack = env.mode === "production" ? require('./webpack.prod.js') : require('./webpack.dev.js');

	// Merge the common webpack config with the new one 
	// Using Object.assign instead of merge because I didn't know about merge when I wrote this and this works fine
	return (Object.assign({}, webPack, {
		entry: entryPoint, 
		output: { 
			filename: "[name].js", 
			path: path.resolve(__dirname, '../dist/__tests__/'),
      publicPath: ''
		},
  	}));
};
