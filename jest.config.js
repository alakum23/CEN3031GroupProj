/**
 * Jest config exports an array of projects with specific config for each test environment
 */

module.exports = {
    projects:  [
        // Run the client source code unit tests
        {
            rootDir: './',
            displayName: "client",
            testEnvironment: "jsdom",
            testRegex: "./test/client/.*\\.test.(js|jsx)$",
            moduleNameMapper:  {
                "\\.(css|sass)$": "identity-obj-proxy",
                "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/mocks/fileMock.js",
            }
        },
        // Run the server source code unit tests
        {
            rootDir: './',
            displayName: "server",
            testEnvironment: "node",
            testRegex: "./test/server/.*\\.test.(js|jsx)$"
        },
        // Run the end to end unit tests
        {
            rootDir: './',
            displayName: "End To End Tests",
            testRegex: "./test/end_to_end.test.(js|jsx)$",
            testEnvironment: 'node'
        }
    ]
};
