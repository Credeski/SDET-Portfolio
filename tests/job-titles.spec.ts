import { test, expect, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.ORANGE_HRM_USERNAME;
if (!username) throw new Error('USERNAME not set');
const password = process.env.ORANGE_HRM_PASSWORD;
if (!password) throw new Error('PASSWORD not set');

// Login and navigate to Job Titles before each test
test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Additional wait for dynamic content
  // Fill in username
    await page.locator('input[name="username"]').fill(username);

  // Fill in password
    await page.locator('input[name="password"]').fill(password);

// Click login button
    await page.locator('button[type="submit"]').click();

    // Go directly to Job Titles
    await page.goto('/web/index.php/admin/viewJobTitleList');
});


//Add Job Title test
test('add job title test', async ({ page }) => {
    // Click Add button
    await page.locator('button:has-text("Add")').click();
    await page.locator('input[name="jobTitle[jobTitle]"]').waitFor();
    // Fill in job title
    const jobTitle = `Test Job Title ${Date.now()}`;
    await page.locator('input[name="jobTitle[jobTitle]"]').fill(jobTitle);  
    // Fill in job description
    await page.locator('textarea[name="jobTitle[jobDescription]"]').fill('This is a test job description.');    
    // Click Save button
    await page.locator('button:has-text("Save")').click();  
    // Verify that the new job title appears in the list
    await expect(page.locator(`div.oxd-table-cell:has-text("${jobTitle}")`)).toBeVisible();
});

//Verify required field validation on job title creation
test('verify required field validation on job title creation', async ({ page }) => {
    // Click Add button
    await page.locator('button:has-text("Add")').click();           
    // Leave job title field empty and click Save button
    await page.locator('button:has-text("Save")').click();  
    // Verify that the required field validation message is displayed
    await expect(page.locator('.oxd-input-field-error-message')).toHaveText('Required');
});


