const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');

// Function to write the specified text in the Excel file
async function writeExcelTest(searchText, replaceText, change, filePath) {
    const workbook = new ExcelJs.Workbook(); // Create a new workbook
    await workbook.xlsx.readFile(filePath); // Read the existing Excel file
    const worksheet = workbook.getWorksheet('Sheet1'); // Get the first sheet by name

    // Find the cell containing the searchText
    const output = await readExcel(worksheet, searchText);
    
    // Get the cell to update based on the row and column found, and the change offset
    const cell = worksheet.getCell(output.row, output.column + change.colChange);
    cell.value = replaceText; // Replace the cell value with the new text

    // Write the updated workbook back to the file
    await workbook.xlsx.writeFile(filePath);
}

// Function to read the Excel file and locate the searchText
async function readExcel(worksheet, searchText) {
    let output = { row: -1, column: -1 }; // Initialize output to indicate not found
    
    // Loop through each row and cell in the worksheet
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) { // Check if the cell value matches searchText
                output.row = rowNumber; // Set the found row
                output.column = colNumber; // Set the found column
            }
        });
    });

    return output; // Return the row and column indices of the found text
}

// Test case for uploading and downloading Excel file validation
test('Upload download excel validation', async ({ page }) => {
    const textSearch = 'Mango'; // Text to search for in the Excel
    const updateValue = 350; // New value to replace "Mango" with

    // Navigate to the upload/download test page
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

    // Start waiting for the download event
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click(); // Click the download button
    const download = await downloadPromise; // Wait for the download to complete

    // Update the downloaded Excel file with the new value
    await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, download.path());

    // Upload the modified Excel file
    await page.locator("#fileinput").setInputFiles(download.path());

    // Locate the updated value in the uploaded Excel sheet
    const textLocator = page.getByText(textSearch);
    const desiredRow = await page.getByRole('row').filter({ has: textLocator });

    // Verify that the updated value is present in the correct cell
    await expect(desiredRow.locator("td")).toContainText(String(updateValue));
});















