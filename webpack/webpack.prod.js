/**
 * Production Specific Webpack Build Configuration File For Frontend
 * 
 * Use this file for any production specific webpack configuration options, 
 * such as minifying files etc.
 */

// Include the webpack merge and the common settings export
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// Production specific optimization plugins (for minimizing and optimizations)
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// Export the production build configuration
module.exports = merge(common, {
    mode: 'production',
    // We minimize the CSS files when in production mode
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
        // Still split chunks to avoid code duplication
        splitChunks: {
            chunks: "all",
        },
    },
    // Some optimizations for production code
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    // Add a CSS plugin to help minify the CSS code
    plugins:  common.plugins.concat([
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ])
});
