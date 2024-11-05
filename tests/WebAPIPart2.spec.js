// Import necessary modules from Playwright
const { test, expect } = require('@playwright/test');
let webContext; // Variable to hold the browser context with stored session state

// This hook runs once before all tests in the file
test.beforeAll(async ({ browser }) => {
    // Create a new browser context for the login session
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the client application login page
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Fill in the email and password fields
    await page.locator("#userEmail").fill("rahulshetty@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    
    // Click the login button
    await page.locator("[value='Login']").click();
    
    // Wait until network activity is idle (indicating the login is complete)
    await page.waitForLoadState('networkidle');
    
    // Save the storage state (including cookies, localStorage, etc.) for session reuse
    await context.storageState({ path: 'state.json' });
    
    // Create a new context using the saved state for subsequent tests
    webContext = await browser.newContext({ storageState: 'state.json' });
});

// Test case for logging in and performing actions in the client application
test('@QA Client App login', async () => {
    const email = "rahulshetty@gmail.com"; // Email for verification later
    const productName = 'iphone 13 pro'; // Product to be added to the cart
    const page = await webContext.newPage(); // Create a new page using the stored context
    
    // Navigate to the client application
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Get the list of products available
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents(); // Fetch all product titles
    console.log(titles); // Log the product titles for debugging
    
    const count = await products.count(); // Count the number of product entries
    for (let i = 0; i < count; ++i) {
        // Check if the product title matches the one we're looking for
        if (await products.nth(i).locator("b").textContent() === productName) {
            // Click the 'Add To Cart' button for the specified product
            await products.nth(i).locator("text= Add To Cart").click();
            break; // Exit the loop once the product is found and added
        }
    }
    
    // Go to the cart page to verify the added product
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); // Wait for the cart items to load
    
    // Check if the product is visible in the cart
    const bool = await page.locator("h3:has-text('iphone 13 pro')").isVisible();
    expect(bool).toBeTruthy(); // Assert that the product is indeed in the cart

    // Proceed to the checkout process
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").fill("ind", { delay: 100 }); // Type "ind" for country selection
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor(); // Wait for the dropdown options to appear
    
    // Select the appropriate country from the dropdown
    const optionsCount = await dropdown.locator("button").count(); // Count the options
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent(); // Get the text of each option
        if (text === " India") { // Check for the specific country
            await dropdown.locator("button").nth(i).click(); // Click the country button if found
            break; // Exit the loop once the country is selected
        }
    }
    
    // Verify that the user's email is displayed before finalizing the order
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click(); // Click the submit button to place the order

    // Verify that a thank-you message is displayed after the order is placed
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent(); // Get the order ID
    console.log(orderId); // Log the order ID for reference
    
    // Navigate to order history to verify the order details
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor(); // Wait for the order table to load
    const rows = await page.locator("tbody tr"); // Get all rows in the order table

    // Loop through the order rows to find the specific order by ID
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent(); // Get the order ID from the row
        if (orderId.includes(rowOrderId)) { // Check if it matches the order ID we retrieved earlier
            await rows.nth(i).locator("button").first().click(); // Click to view order details
            break; // Exit the loop once the matching order is found
        }
    }
    
    // Verify that the order details display the correct order ID
    const orderIdDetails = await page.locator(".col-text").textContent(); // Get the order ID details
    expect(orderId.includes(orderIdDetails)).toBeTruthy(); // Assert that the details match
});

// Another test case placeholder for API-related tests
test('@API Test case 2', async () => {
    const email = "rahulshetty@gmail.com"; // Email for verification or API tests
    const productName = 'iphone 13 pro'; // Product name for API verification
    const page = await webContext.newPage(); // Create a new page using the stored context
    
    // Navigate to the client application
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle'); // Wait until the page is fully loaded

    // Fetch product titles for verification
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents(); // Get all product titles
    console.log(titles); // Log titles for debugging

    // Add any API testing logic here...
    // You could call your API endpoints to verify data, simulate orders, etc.
});
