// Import necessary functions from Playwright
const { test, expect } = require('@playwright/test');

// Define a test for logging into the client application
test('@Webst Client App login', async ({ page }) => {
    // User credentials and the product name to add to the cart
    const email = "anshika@gmail.com"; // Email for login
    const productName = 'ZARA COAT 3'; // Product to be added to cart
    
    // Locator for the product cards on the page
    const products = page.locator(".card-body");
    
    // Navigate to the client application's login page
    await page.goto("https://rahulshettyacademy.com/client");
    
    // Fill in the login form
    await page.locator("#userEmail").fill(email); // Fill the email field
    await page.locator("#userPassword").fill("Iamking@000"); // Fill the password field
    await page.locator("[value='Login']").click(); // Click the login button
    
    // Wait for the page to fully load after login
    await page.waitForLoadState('networkidle');
    
    // Wait for the first product card to be visible
    await page.locator(".card-body b").first().waitFor();
    
    // Retrieve and log the titles of all products available
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles); 
    
    // Count the number of product cards available
    const count = await products.count();
    
    // Iterate through the product cards to find the specified product
    for (let i = 0; i < count; ++i) {
        // Check if the product name matches the one we want to add
        if (await products.nth(i).locator("b").textContent() === productName) {
            // If a match is found, click the "Add To Cart" button for that product
            await products.nth(i).locator("text= Add To Cart").click();
            break; // Exit the loop after adding the product
        }
    }

    // Navigate to the cart page to view added items
    await page.locator("[routerlink*='cart']").click();
    
    // Wait for the cart items to be visible
    await page.locator("div li").first().waitFor();
    
    // Check if the added product is visible in the cart
    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy(); // Expect the product to be visible in the cart
    
    // Proceed to the checkout page
    await page.locator("text=Checkout").click();

    // Type the country name to search in the country input field
    await page.locator("[placeholder*='Country']").pressSequentially("ind");
    
    // Locator for the dropdown of country suggestions
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor(); // Wait for dropdown options to load
    
    // Count the number of dropdown options available
    const optionsCount = await dropdown.locator("button").count();
    
    // Iterate through the dropdown options to find "India"
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " India") { // Match the exact country name
            await dropdown.locator("button").nth(i).click(); // Click on the country option
            break; // Exit the loop after selecting the country
        }
    }

    // Verify that the email address displayed on the checkout page matches the login email
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    
    // Submit the order
    await page.locator(".action__submit").click();
    
    // Verify the order confirmation message
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    
    // Retrieve and log the order ID from the confirmation page
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId); // Log the order ID for debugging

    // Navigate to the orders page to view order history
    await page.locator("button[routerlink*='myorders']").click();
    
    // Wait for the order history table to load
    await page.locator("tbody").waitFor();
    
    // Locator for the order rows in the order history
    const rows = await page.locator("tbody tr");

    // Iterate through the rows of orders to find the recently placed order
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent(); // Get the order ID from the row
        if (orderId.includes(rowOrderId)) { // Check if the order ID matches
            await rows.nth(i).locator("button").first().click(); // Click on the details button for that order
            break; // Exit the loop after finding the order
        }
    }
    
    // Retrieve the details of the selected order
    const orderIdDetails = await page.locator(".col-text").textContent();
    
    // Verify that the displayed order ID details match the order ID
    expect(orderId.includes(orderIdDetails)).toBeTruthy(); // Ensure the order ID is correctly matched
});
