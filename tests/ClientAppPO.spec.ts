// Import necessary functions from Playwright and other utility modules
import { test, expect } from '@playwright/test';
 // Import a custom test utility (not used in this example)
import { POManager } from '../pageobjects_ts/POManager'; // Import the Page Object Manager

// Load test data from a JSON file and convert it to a JavaScript object
const dataset = JSON.parse(JSON.stringify(require("../utils/placeorderTestData.json")));

// Iterate through each data set (product information) for running tests
for (const data of dataset) {
    
    // Define a test case for placing an order using the product name from the data
    test(`@Webs Client App login for ${data.productName}`, async ({ page }) => {
        
        // Create an instance of the Page Object Manager for handling page interactions
        const poManager = new POManager(page);
        
        // Use locators to find elements on the page
        const products = page.locator(".card-body"); // Locator for product cards
        
        // Get the login page object from the Page Object Manager
        const loginPage = poManager.getLoginPage();
        
        // Navigate to the login page and perform login with provided credentials
        await loginPage.goTo();
        await loginPage.validLogin(data.username, data.password);
        
        // Get the dashboard page object to interact with the dashboard after login
        const dashboardPage = poManager.getDashboardPage();
        
        // Search for the specified product and add it to the cart
        await dashboardPage.searchProductAddCart(data.productName);
        
        // Navigate to the cart page to verify the added product
        await dashboardPage.navigateToCart();
        
        // Get the cart page object to interact with the cart
        const cartPage = poManager.getCartPage();
        
        // Verify that the expected product is displayed in the cart
        await cartPage.VerifyProductIsDisplayed(data.productName);
        
        // Proceed to checkout
        await cartPage.Checkout();
        
        // Get the orders review page object for order confirmation
        const ordersReviewPage = poManager.getOrdersReviewPage();
        
        // Enter the country and select it from the dropdown
        await ordersReviewPage.searchCountryAndSelect("ind", "India");
        
        // Declare a variable to hold the order ID
        let orderId: any;
        
        // Submit the order and retrieve the order ID
        orderId = await ordersReviewPage.SubmitAndGetOrderId();
        console.log(orderId); // Log the order ID to the console
        
        // Navigate to the orders section to review past orders
        await dashboardPage.navigateToOrders();
        
        // Get the orders history page object to interact with the order history
        const ordersHistoryPage = poManager.getOrdersHistoryPage();
        
        // Search for the specific order using the order ID and select it
        await ordersHistoryPage.searchOrderAndSelect(orderId);
        
        // Verify that the displayed order ID matches the submitted order ID
        expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
    });
}




customTest(`Client App login`, async ({page,testDataForOrder})=>
 {
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     const products = page.locator(".card-body");
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(testDataForOrder.username,testDataForOrder.password);
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(testDataForOrder.productName);
     await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.Checkout();


})

function customTest(arg0: string, arg1: ({ page, testDataForOrder }: { page: any; testDataForOrder: any; }) => Promise<void>) {
  throw new Error('Function not implemented.');
}
//test files will trigger parallel
//individual tests in the file will run in sequence
 

 



 

