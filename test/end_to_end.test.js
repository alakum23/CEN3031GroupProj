// Import Statements
const puppeteer = require('puppeteer');
const portfinder = require('portfinder');
const app = require('../src/server/server.js');
const maxTestTime = 30000;

// Gloabls that we need
let server = null;
let port = null;
let browser;
let page;

// Do this before the tests run
beforeAll(async () => {
    port = await portfinder.getPortPromise();
    server = app.listen(port);
    browser = await puppeteer.launch();
});

// Do this after all test finishes
afterAll(async () => {
    browser.close();
    server.close();
    // Include a small delay to allow server to close and avoid a warning message
    await new Promise(resolve => setTimeout(() => resolve(), 500));
});




// Test functions here
describe('Page Navigation Tests', () =>  {
    // Do this before all the page navigation tests starts
    
    // Do this after all the page navigation tests finish

    // Tests

    it('Should display the /viewer page properly', async () =>  {
        page = await browser.newPage(); 
        await page.goto(`http://127.0.0.1:${port}/viewer`, { waitUntil: "domcontentloaded" }); 
        expect(page.url()).toBe(`http://127.0.0.1:${port}/viewer`);
        await expect(page.title()).resolves.toMatch('HazardVis');

        await page.close();
    }, maxTestTime);

    it('Should redirect nonsense routes to /viewer', async () => {
        page = await browser.newPage();

        await page.goto(`http://127.0.0.1:${port}`); 
        expect(page.url()).toBe(`http://127.0.0.1:${port}/viewer`);
        await expect(page.title()).resolves.toMatch('HazardVis');

        await page.goto(`http://127.0.0.1:${port}/nonsense-route`); 
        expect(page.url()).toBe(`http://127.0.0.1:${port}/viewer`);
        await expect(page.title()).resolves.toMatch('HazardVis');

        await page.goto(`http://127.0.0.1:${port}/nonsense-route/nested-again/crazy-route`); 
        expect(page.url()).toBe(`http://127.0.0.1:${port}/viewer`);
        await expect(page.title()).resolves.toMatch('HazardVis');

        await page.close();
    }, maxTestTime);
});

// Test functions here
describe('Api Route Tests', () =>  {
    // Do this before all the api route tests start


    // Tests

    it('Should return some data when going to /api/test route', async () =>  {
        page = await browser.newPage(); 
        await page.goto(`http://127.0.0.1:${port}/api/test`, { waitUntil: "domcontentloaded" }); 
        expect(page.url()).toBe(`http://127.0.0.1:${port}/api/test`);
        
        let text = await page.evaluate(() => document.body.textContent)
        expect(text).toContain('{\"body\":\"Hello\"}');

        await page.close();
    }, maxTestTime);
});

// Test functions here
describe('Viewer Page UI', () =>  {

    // Do this before all the viewer page UI tests start

    // Tests

    it('Should have a viewer element on the page', async () =>  {
        page = await browser.newPage(); 
        await page.goto(`http://127.0.0.1:${port}/viewer`, { waitUntil: "domcontentloaded" }); 

        await page.waitForSelector('#cesiumContainer');
        
        let containerExists = await page.evaluate(() => {
            let el = document.querySelector("#cesiumContainer")
            return el ? true : false;
        });

        expect(containerExists).toBeTruthy();
        await page.close();
    }, maxTestTime);
});
