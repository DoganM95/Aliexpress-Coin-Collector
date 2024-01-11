const puppeteer = require("puppeteer");
require("dotenv").config();

const username = process.env.ALIEXPRESS_USERNAME;
const password = process.env.ALIEXPRESS_PASSWORD;

async function login(page) {
    await page.goto("https://login.aliexpress.com"); // Go to login page
    await page.waitForSelector("#fm-login-id", { visible: true }); // Wait for username input field to be available
    await page.waitForSelector("#fm-login-password", { visible: true }); // Wait for password input field to be available
    await page.type("input#fm-login-id", username); // Input username
    await page.type("input#fm-login-password", password); // Input username
    await page.click("button.comet-btn"); // Click continue
    // await page.screenshot({ path: "username_inserted.jpg" }).catch((e) => console.error(e));
    // await page.type("#password", password); // Input password
    // await page.waitForNavigation();
}

async function isLoggedIn(page) {
    const loggedIn = await page.evaluate(() => {
        return !!document.querySelector("#elementVisibleWhenLoggedIn"); // selector for an item only existing after a successful login
    });
    return loggedIn;
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await login(page);

    // Polling loop
    const checkInterval = 5 * 60 * 1000; // 5 minutes, adjust as needed
    setInterval(async () => {
        if (!(await isLoggedIn(page))) {
            console.log("Not logged in. Logging in again...");
            await login(page);
        } else {
            console.log("Still logged in.");
        }
    }, checkInterval);
})();
