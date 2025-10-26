import { test, expect } from '@playwright/test';
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
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    const jobTitle = `Test Job Title ${Date.now()}`;
    await page.locator('.oxd-input').first().fill(jobTitle);  
    // Fill in job description
    await page.getByPlaceholder('Type description here').fill('This is a test job description.');    
    // Click Save button
    await page.locator('button:has-text("Save")').click();  
    //Wait for the page to reload and show the job titles list
    await page.locator('h6:has-text("Job Titles")').waitFor();
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

//Delete Job Title test
test('delete job title test', async ({ page }) => {
    const jobTitleToDelete = 'Test Job Title to Delete';    
    // First, add a job title to delete
    await page.locator('button:has-text("Add")').click();
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    await page.locator('.oxd-input').first().fill(jobTitleToDelete);
    await page.locator('button:has-text("Save")').click();
    await page.locator('h6:has-text("Job Titles")').waitFor();

    // Now delete the job title
    await page.locator(`div.oxd-table-row:has-text("${jobTitleToDelete}") i.bi-trash`).click();
    await page.locator('button:has-text("Yes, Delete")').click();

    // Verify that the job title has been deleted
    await expect(page.locator(`div.oxd-table-cell:has-text("${jobTitleToDelete}")`)).toHaveCount(0);
});

//Edit Job Title test
test('edit job title test', async ({ page }) => {
    const originalJobTitle = `Original Job Title ${Date.now()}`;
    await page.locator('button:has-text("Add")').click();
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    await page.locator('.oxd-input').first().fill(originalJobTitle);
    await page.locator('button:has-text("Save")').click();
    await page.locator('h6:has-text("Job Titles")').waitFor();

    // Now edit the job title
    const newJobTitle = `Edited Job Title ${Date.now()}`;
    await page.locator(`div.oxd-table-row:has-text("${originalJobTitle}") .bi-pencil-fill`).click();
    await page.locator('.oxd-input').first().fill(newJobTitle);
    await page.locator('button:has-text("Save")').click();

    // Verify that the job title has been edited
    await expect(page.locator(`div.oxd-table-cell:has-text("${newJobTitle}")`)).toBeVisible();
    await expect(page.locator(`div.oxd-table-cell:has-text("${originalJobTitle}")`)).toHaveCount(0);
});
