/**
 * Development Specific Webpack Build Configuration File For Frontend
 * 
 * Use this file for any development specific webpack configuration options, 
 * such as including devtools, etc.
 */

// Include the webpack merge and the common settings export
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// Development specific plugins
const ESLintPlugin = require('eslint-webpack-plugin');

// Update all the entry points for hotmodule reloading
const newEntryPoints = Object.keys(common.entry).reduce((accumulator, key) => {
    return {...accumulator, [key]: ['webpack-hot-middleware/client', common.entry[key]]};
}, {});

// Export the development build configuration
module.exports = merge(common, {
    mode: 'development',
    entry: newEntryPoints,
    // Use devtool eval-source-map so we can debug the bundle when running development mode
    devtool: 'eval-source-map',
    // Specify the watchOptions to ignore the node_modules for faster hot module reloading
    watchOptions: {
        ignored: '/node_modules/',
    },
    plugins: common.plugins.concat([
        new webpack.NoEmitOnErrorsPlugin(), 
        new webpack.HotModuleReplacementPlugin(), 
        new ESLintPlugin({
            // formatter: 'codeframe', // table
            extensions: ['js', 'jsx'],
            // cache: true,
            failOnError: false,
            failOnWarning: false,
            emitWarning: true,
        })
    ]),
});
