// Import necessary functions from Playwright
const { test, expect } = require('@playwright/test');

// Test for validating popups and UI elements on a webpage
test("@Web Popup validations", async ({ page }) => {
    // Navigate to the specified webpage
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // Assert that the element with id 'displayed-text' is visible
    await expect(page.locator("#displayed-text")).toBeVisible();
    
    // Click the button to hide the textbox
    await page.locator("#hide-textbox").click();
    
    // Assert that the element with id 'displayed-text' is hidden after the click
    await expect(page.locator("#displayed-text")).toBeHidden();
    
    // Listen for dialog events and accept any dialog that appears
    page.on('dialog', dialog => dialog.accept());
    
    // Click the button that triggers a confirmation dialog
    await page.locator("#confirmbtn").click();
    
    // Hover over the element with id 'mousehover'
    await page.locator("#mousehover").hover();
    
    // Locate and interact with an iframe on the page
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    
    // Get the text content from a specific element within the iframe and log part of it
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]); // Logs the second word of the text
});

// Test for taking screenshots and visual comparison
test("Screenshot & Visual comparison", async ({ page }) => {
    // Navigate to the specified webpage
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    
    // Assert that the element with id 'displayed-text' is visible
    await expect(page.locator("#displayed-text")).toBeVisible();
    
    // Take a screenshot of the 'displayed-text' element and save it to a file
    await page.locator('#displayed-text').screenshot({ path: 'partialScreenshot.png' });
    
    // Click the button to hide the textbox
    await page.locator("#hide-textbox").click();
    
    // Take a full-page screenshot and save it to a file
    await page.screenshot({ path: 'screenshot.png' });
    
    // Assert that the element with id 'displayed-text' is hidden after the click
    await expect(page.locator("#displayed-text")).toBeHidden();
});

// Test for visual comparison of the landing page
test('visual', async ({ page }) => {
    // Navigate to the login page for practice
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    
    // Take a screenshot of the current page and compare it to a baseline image
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
});
