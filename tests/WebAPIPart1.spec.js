// Import necessary modules from Playwright
const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils'); // Import custom API utility functions

// Payloads for login and order creation
const loginPayLoad = {
    userEmail: "anshika@gmail.com", // User email for login
    userPassword: "Iamking@000" // User password for login
};

const orderPayLoad = {
    orders: [{
        country: "Cuba", // Country for the order
        productOrderedId: "6262e95ae26b7e1a10e89bf0" // ID of the product being ordered
    }]
};

let response; // Variable to hold the response from the API after creating the order

// Hook that runs before all tests
test.beforeAll(async () => {
    // Create a new context for API requests
    const apiContext = await request.newContext();
    
    // Instantiate API utility with the context and login payload
    const apiUtils = new APiUtils(apiContext, loginPayLoad);
    
    // Call createOrder method to create an order and store the response
    response = await apiUtils.createOrder(orderPayLoad);
});

// Test case for placing the order
test('@API Place the order', async ({ page }) => {
    // Add the token received from the API response to local storage for authentication
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    
    // Navigate to the client application
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Click on the button to go to the orders page
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor(); // Wait for the orders table to be rendered
    
    // Find the order in the orders table
    const rows = await page.locator("tbody tr"); // Get all the rows in the orders table
    let orderFound = false; // Flag to track whether the order was found

    // Loop through each row to find the matching order ID
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent(); // Get the order ID from the current row
        if (response.orderId.includes(rowOrderId)) { // Check if the row order ID matches the response order ID
            await rows.nth(i).locator("button").first().click(); // Click to view the order details
            orderFound = true;  // Mark that the order was found and clicked
            break; // Exit the loop since the order has been found
        }
    }

    // Check if the order details are displayed correctly
    const orderIdDetails = await page.locator(".col-text").textContent(); // Get the order ID from the order details section
    expect(orderFound).toBe(true, "Order not found in the orders list."); // Assert that the order was found
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy(); // Assert that the order ID in the response is included in the order details
});

// Additional comments can be added here for clarity
