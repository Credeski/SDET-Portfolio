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
    // // Wait for successful login by checking for dashboard or main menu
    // await page.locator(".oxd-main-menu").waitFor({ state: "visible", timeout: 60000 });

    //Navigate to Add Employee page
    await page.goto("/web/index.php/pim/viewEmployeeList");
    await page.waitForLoadState("networkidle");
});

// Add Employee test
test("add employee test", async ({ page }) => {
    const employeeName = `Test Employee ${Date.now()}`;
    // Click Add button
    await page.getByRole('button', { name: 'Add' }).click();
    await page.locator('h6:has-text("Add Employee")').waitFor({ timeout: 60000 });
    // Fill in employee name
    await page.locator('input[name="firstName"]').fill("Test");
    await page.locator('input[name="lastName"]').fill("Employee");
    // await page.locator('input[name="employeeId"]').fill(employeeName);
    await page.locator('button:has-text("Save")').click();
    await page.locator('h6:has-text("Personal Details")').waitFor({ timeout: 60000 });
});
