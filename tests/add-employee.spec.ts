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
    await page.waitForLoadState('domcontentloaded');
    // Fill in username 
    await page.locator('input[name="username"]').fill(username);
    // Fill in password 
    await page.locator('input[name="password"]').fill(password);    
    // Click login button
    await page.locator('button[type="submit"]').click();
    // Wait for dashboard to be visible
      // Wait for dashboard or sidebar to confirm login
    await page.locator('.oxd-main-menu').first().waitFor({ state: 'visible', timeout: 60000 });

    //Navigate to Add Employee page
    await page.goto("/web/index.php/pim/viewEmployeeList");
    await page.getByRole('button', { name: 'Add' }).waitFor({ state: 'visible', timeout: 60000 });
});
 // Generate dynamic employee names
const timestamp = Date.now();
const employeeFirstName = `TestFirst${timestamp}`;
const employeeLastName = `TestLast${timestamp}`;

// TC001 - Add employee
test("add employee test", async ({ page }) => {
    // Click Add button
    await page.getByRole('button', { name: 'Add' }).click();
    await page.locator('h6:has-text("Add Employee")').waitFor({ timeout: 60000 });
    // Fill in employee name
    await page.locator('input[name="firstName"]').fill(employeeFirstName);
    await page.locator('input[name="lastName"]').fill(employeeLastName);
    // Wait for the loader to 
    // Click Save button
    await page.locator('button:has-text("Save")').click();
    await page.locator('h6:has-text("Personal Details")').waitFor({ timeout: 60000 });
    await page.locator('button:has-text("Save")').click();
    // Navigate back to Employee List
    await page.goto("/web/index.php/pim/viewEmployeeList");
    await page.waitForLoadState('domcontentloaded');
    // Search for the newly added employee
    await page.locator('input[placeholder="Type for hints..."]').first().fill(`${employeeFirstName} ${employeeLastName}`);
    await page.getByRole('button', { name: 'Search' }).click();
    // Verify the employee appears in the list
    await expect(page.locator(`text=${employeeFirstName} ${employeeLastName}`)).toBeVisible();
});

// TC002 - Mandatory fields validation
test("add employee mandatory fields validation", async ({ page }) => {
    // Click Add button
    await page.getByRole('button', { name: 'Add' }).click();
    await page.locator('h6:has-text("Add Employee")').waitFor({ timeout: 60000 });
    // Click Save button without filling any fields
    await page.locator('button:has-text("Save")').click();
    // Verify validation messages
    await expect(page.locator('span:has-text("Required")')).toHaveCount(2);
});

// TC008 - Add employee with login credentials
test("add employee with login credentials", async ({ page }) => {
    // Click Add button
    await page.getByRole('button', { name: 'Add' }).click();    
    await page.locator('h6:has-text("Add Employee")').waitFor({ timeout: 60000 });
    // Fill in employee name
    await page.locator('input[name="firstName"]').fill(`LoginFirst${timestamp}`);
    await page.locator('input[name="lastName"]').fill(`LoginLast${timestamp}`);
    // Enable Create Login Details
    const loginToggle = page.locator('.oxd-switch-input');
    await loginToggle.waitFor({ state: 'visible', timeout: 30000 });
    await loginToggle.click();
    // Use a unique username
    const usernameInput = page.locator('.oxd-input-group:has(label:has-text("Username")) input');
    await usernameInput.fill(`loginuser${timestamp}`);
    // Fill in password and confirm password
    const passwordInput = page.locator('.oxd-input-group:has(label:has-text("Password")) input').first();
    const confirmPasswordInput = page.locator('.oxd-input-group:has(label:has-text("Confirm Password")) input');
    await passwordInput.fill(`Not-guessable/12345`);
    await confirmPasswordInput.fill(`Not-guessable/12345`);
    // Click Save button
    await page.locator('button:has-text("Save")').click();
    await page.pause();
    await page.locator('h6:has-text("Personal Details")').waitFor({ timeout: 100000 });
    await page.locator('button:has-text("Save")').click();
    // Navigate back to Employee List
    await page.goto("/web/index.php/pim/viewEmployeeList");
    await page.waitForLoadState("networkidle");
    // Search for the newly added employee
    await page.locator('input[placeholder="Type for hints..."]').first().fill(`LoginFirst${timestamp} LoginLast${timestamp}`);
    await page.getByRole('button', { name: 'Search' }).click();
    // Verify the employee appears in the list
    await expect(page.locator(`text=LoginFirst${timestamp} LoginLast${timestamp}`)).toBeVisible({ timeout: 15000 });
});