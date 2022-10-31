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
                "\\.(css|sass)$": "identity-obj-proxy"
            }
        },
        // Run the server source code unit tests
        {
            rootDir: './',
            displayName: "server",
            testEnvironment: "node",
            testRegex: "./test/server/.*\\.test.(js|jsx)$"
        },
        // Run the built client unit tests
        {
            rootDir: './',
            displayName: "build",
            testEnvironment: "jsdom",
            testRegex: "./dist/__tests__/.*\\.test.(js|jsx)$",
            moduleNameMapper: {
                "\\.(css|sass)$": "identity-obj-proxy",
                '/src/viewer$': '<rootDir>/dist/static/viewer.bundle', //paths of the main html page bundles????? IS THIS NEEDED?
                '/src/login$': '<rootDir>/dist/static/login.bundle'
            }
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
