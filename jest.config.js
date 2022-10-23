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
            testRegex: "./test/frontend/.*\\.(js|jsx)$",
            moduleNameMapper:  {
                "\\.(css|sass)$": "identity-obj-proxy"
            }
        },
        // Run the server source code unit tests
        {
            rootDir: './',
            displayName: "server",
            testEnvironment: "node",
            testRegex: "./test/backend/.*\\.(js|jsx)$"
        },
        // Run the built client unit tests
        {
            rootDir: './',
            displayName: "build",
            testEnvironment: "jsdom",
            testRegex: "./dist/__tests__/.*\\.(js|jsx)$",
            moduleNameMapper: {
                "\\.(css|sass)$": "identity-obj-proxy",
                '/src/viewer$': '<rootDir>/dist/static/viewer.bundle', //paths of the main html page bundles????? IS THIS NEEDED?
                '/src/login$': '<rootDir>/dist/static/login.bundle'
            }
        }
    ]
};
