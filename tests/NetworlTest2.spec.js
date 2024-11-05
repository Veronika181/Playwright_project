// Import necessary modules from Playwright
const { test, expect } = require('@playwright/test');

// Define a test case for security testing request interception
test('@QW Security test request intercept', async ({ page }) => {
    
    // Navigate to the client login page
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Fill in the login credentials
    await page.locator("#userEmail").fill("anshika@gmail.com"); // Enter email
    await page.locator("#userPassword").fill("Iamking@000"); // Enter password
    
    // Click the login button
    await page.locator("[value='Login']").click();
    
    // Wait for the page to fully load (network is idle)
    await page.waitForLoadState('networkidle');
    
    // Wait for the product cards to appear (indicating successful login)
    await page.locator(".card-body b").first().waitFor();
    
    // Navigate to the orders page
    await page.locator("button[routerlink*='myorders']").click();
    
    // Intercept the network request to get order details
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        // Change the request to return a specific order ID
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' })
    );

    // Click on the first "View" button to see order details
    await page.locator("button:has-text('View')").first().click();
    
    // Verify that the response indicates unauthorized access to the order
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});
