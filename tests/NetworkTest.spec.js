// Import necessary modules from Playwright
const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');

// Define login payload with user credentials
const loginPayLoad = { 
    userEmail: "anshika@gmail.com", 
    userPassword: "Iamking@000" 
};

// Define order payload for creating an order
const orderPayLoad = { 
    orders: [{ 
        country: "India", 
        productOrderedId: "6262e95ae26b7e1a10e89bf0" 
    }] 
};

// Define a fake payload for simulating no orders response
const fakePayLoadOrders = { 
    data: [], 
    message: "No Orders" 
};

let response;

// Before all tests, create a new API context and create an order
test.beforeAll(async () => {
    // Create a new API context for making requests
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, loginPayLoad);
    
    // Create an order and store the response, including the token
    response = await apiUtils.createOrder(orderPayLoad);
});

// Test case to place the order and handle response interception
test('@SP Place the order', async ({ page }) => {
    // Store the authentication token in local storage to maintain session
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    
    // Navigate to the client application
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Intercept the API request for fetching orders for the customer
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            // Fetch the original request to ensure the flow continues
            const response = await page.request.fetch(route.request());
            
            // Create a fake response body simulating no orders
            let body = JSON.stringify(fakePayLoadOrders);
            
            // Fulfill the intercepted request with the fake response
            route.fulfill({
                response, // Use the original response to keep headers/status
                body, // Set the body to the fake response
            });
            // This intercepts the API response, so the browser receives the fake response instead of the real one.
        }
    );

    // Click on the button to navigate to the orders page
    await page.locator("button[routerlink*='myorders']").click();
    
    // Wait for the response of the intercepted API call
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    
    // Log the text content of the element that shows the order status/message
    console.log(await page.locator(".mt-4").textContent());
});
