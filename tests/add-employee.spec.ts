import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const username = process.env.ORANGE_HRM_USERNAME;
if (!username) throw new Error("USERNAME not set");
const password = process.env.ORANGE_HRM_PASSWORD;
if (!password) throw new Error("PASSWORD not set");

// Login before each test
test.beforeEach(async ({ page }) => {
    await page.goto("/web/index.php/auth/login"); 
    await page.waitForLoadState("networkidle");
    // Fill in username 
    await page.locator('input[name="username"]').fill(username);
    // Fill in password 
    await page.locator('input[name="password"]').fill(password);    
    // Click login button
    await page.locator('button[type="submit"]').click();
    //Navigate to Add Employee page
    await page.goto("/web/index.php/pim/viewEmployeeList");
    await page.waitForLoadState("networkidle");
});

// Add Employee test
test("add employee test", async ({ page }) => {
    const employeeFirstName = `Test`;
    const employeeLastName = `Employee ${Date.now()}`;

    // Click Add button
    await page.getByRole('button', { name: 'Add' }).click();
    await page.locator('h6:has-text("Add Employee")').waitFor({ timeout: 60000 });
    // Fill in employee name
    await page.locator('input[name="firstName"]').fill(employeeFirstName);
    await page.locator('input[name="lastName"]').fill(employeeLastName);
    // Click Save button
    await page.locator('button:has-text("Save")').click();
    await page.locator('h6:has-text("Personal Details")').waitFor({ timeout: 60000 });
    await page.locator('button:has-text("Save")').click();
    // Navigate back to Employee List
    await page.goto("/web/index.php/pim/viewEmployeeList");
    await page.waitForLoadState("networkidle");
    // Search for the newly added employee
    await page.locator('input[placeholder="Type for hints..."]').first().fill(`${employeeFirstName} ${employeeLastName}`);
    await page.getByRole('button', { name: 'Search' }).click();
    // Verify the employee appears in the list
    await expect(page.locator(`text=${employeeFirstName} ${employeeLastName}`)).toBeVisible();
});

// Verify that mandatory fields validation works
test("add employee mandatory fields validation", async ({ page }) => {
    // Click Add button
    await page.getByRole('button', { name: 'Add' }).click();
    await page.locator('h6:has-text("Add Employee")').waitFor({ timeout: 60000 });
    // Click Save button without filling any fields
    await page.locator('button:has-text("Save")').click();
    // Verify validation messages
    await expect(page.locator('span:has-text("Required")')).toHaveCount(2);
});