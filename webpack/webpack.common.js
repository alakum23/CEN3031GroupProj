/**
 * Non-Specific Webpack Build Configuration File For Frontend
 * 
 * Use this file for any webpack configurations that apply
 * to both development and production builds. This includes
 * bundling the Cesium Library, registering all HTML pages, etc.
 */

// The path to the CesiumJS source code
const cesiumSource = '../node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

// Webpack setup imports
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Define the html pages names here
const htmlPageNames = ['viewer'];

// Define all the entry points used by the html pages
const entryPoints = htmlPageNames.reduce((config, page) => { 
    config[page] = `../src/client/${page}.js`; return config; 
}, {});

// Define all the html page templates as HTML plugins so they are built properly
const multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    inject: true,
    template: `../src/client/html/${name}.html`, // relative path to the HTML files
    filename: `../${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

// Export the common webpack configuration
module.exports = {
    context: __dirname,
    target: 'web',
    entry: entryPoints,
    // Specify the output bundles to build to the dist/static directory so they can easily be served by express
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist/static'),
        publicPath: '/static/',
        sourcePrefix: '',
    },
    // These resolve statements are necessary for cesium to bundle correctly
    resolve: {
        fallback: { "https": false, "zlib": false, "http": false, "url": false },
        mainFiles: ['index', 'Cesium']
    },
    module: {
        rules: [
        {
            // Transpiles ES6-8 into ES5
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            // Loads the javacript into html template provided.
            // Entry point is set using the multipleHTMLPlugins array we made earlier 
            test: /\.html$/,
            use: [{loader: "html-loader"}]
        },
        {
            // Load in the css using the style and css loaders so they are built into the js bundles...
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            // Copy all images and similar files as an asset so they aren't duplicated...
            test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
            // use: [ 'file-loader' ],
            type: 'asset/resource'
        }]
    },
    // Use split chunks optimization to remove duplication of code in the build...
    optimization: {
        splitChunks: {
          chunks: "all",
        },
    },
    plugins: [
        // Copy Cesium Assets, Widgets, and Workers to a static directory...
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(cesiumSource, cesiumWorkers), to: './Workers' },
                { from: path.join(cesiumSource, 'Assets'), to: './Assets' },
                { from: path.join(cesiumSource, 'Widgets'), to: './Widgets' }
            ]
        }),
        // Define relative base path in cesium for loading assets
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify('static/')
        })
    ].concat(multipleHtmlPlugins),
};
