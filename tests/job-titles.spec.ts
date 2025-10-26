import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.ORANGE_HRM_USERNAME;
if (!username) throw new Error('USERNAME not set');
const password = process.env.ORANGE_HRM_PASSWORD;
if (!password) throw new Error('PASSWORD not set');

// Array to track added job titles for cleanup
let addedJobTitles: string[] = [];

// Login and navigate to Job Titles before each test
test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');
    // Fill in username
    await page.locator('input[name="username"]').fill(username);
    // Fill in password
    await page.locator('input[name="password"]').fill(password);
    // Click login button
    await page.locator('button[type="submit"]').click();
    // Wait for successful login by checking for dashboard or main menu
    await page.locator('.oxd-main-menu').waitFor({ state: 'visible' });
    // Go directly to Job Titles
    await page.goto('/web/index.php/admin/viewJobTitleList');
    await page.waitForLoadState('networkidle');
});

// Cleanup after each test
test.afterEach(async ({ page }) => {
    for (const title of addedJobTitles) {
        try {
            const deleteIcon = page.locator(`div.oxd-table-row:has-text("${title}") i.bi-trash`);
            if (await deleteIcon.isVisible()) {
                await deleteIcon.scrollIntoViewIfNeeded();
                await deleteIcon.click();
                await page.locator('button:has-text("Yes, Delete")').click();
                await page.locator('.oxd-toast').waitFor({ state: 'visible' });
            }
        } catch (error) {
            console.warn(`Failed to delete job title "${title}": ${error}`);
        }
    }
    addedJobTitles = [];
});


//Add Job Title test
test('add job title test', async ({ page }) => {
    // Click Add button
    await page.locator('button:has-text("Add")').click();
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    const jobTitle = `Test Job Title ${Date.now()}`;
    await page.locator('.oxd-input').first().fill(jobTitle);
    addedJobTitles.push(jobTitle); // Track for cleanup
    // Fill in job description
    await page.getByPlaceholder('Type description here').fill('This is a test job description.');
    // Click Save button
    await page.locator('button:has-text("Save")').click();
    // Wait for success message or page reload
    await page.locator('.oxd-toast').waitFor({ state: 'visible' });
    //Wait for the page to reload and show the job titles list
    await page.locator('h6:has-text("Job Titles")').waitFor();
    // Verify that the new job title appears in the list
    const jobTitleCell = page.locator(`div.oxd-table-cell:has-text("${jobTitle}")`);
    await jobTitleCell.scrollIntoViewIfNeeded();
    await expect(jobTitleCell).toBeVisible();
});

//Verify required field validation on job title creation
test('verify required field validation on job title creation', async ({ page }) => {
    // Click Add button
    await page.locator('button:has-text("Add")').click();
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    // Leave job title field empty and click Save button
    await page.locator('button:has-text("Save")').click();
    // Verify that the required field validation message is displayed
    const errorMessage = page.locator('.oxd-input-field-error-message');
    await errorMessage.waitFor({ state: 'visible' });
    await expect(errorMessage).toHaveText('Required');
});

//Delete Job Title test
test('delete job title test', async ({ page }) => {
    const jobTitleToDelete = `Test Job Title to Delete ${Date.now()}`;
    // First, add a job title to delete
    await page.locator('button:has-text("Add")').click();
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    await page.locator('.oxd-input').first().fill(jobTitleToDelete);
    await page.locator('button:has-text("Save")').click();
    await page.locator('.oxd-toast').waitFor({ state: 'visible' });
    await page.locator('h6:has-text("Job Titles")').waitFor();

    // Now delete the job title
    const deleteIcon = page.locator(`div.oxd-table-row:has-text("${jobTitleToDelete}") i.bi-trash`);
    await deleteIcon.scrollIntoViewIfNeeded();
    await deleteIcon.click();
    await page.locator('button:has-text("Yes, Delete")').click();
    // Wait for deletion confirmation
    await page.locator('.oxd-toast').waitFor({ state: 'visible' });

    // Verify that the job title has been deleted
    await expect(page.locator(`div.oxd-table-cell:has-text("${jobTitleToDelete}")`)).toHaveCount(0);
});

//Edit Job Title test
test('edit job title test', async ({ page }) => {
    const originalJobTitle = `Original Job Title ${Date.now()}`;
    await page.locator('button:has-text("Add")').click();
    await page.locator('h6:has-text("Add Job Title")').waitFor();
    await page.locator('.oxd-input').first().fill(originalJobTitle);
    addedJobTitles.push(originalJobTitle); // Track for cleanup
    await page.locator('button:has-text("Save")').click();
    await page.locator('.oxd-toast').waitFor({ state: 'visible' });
    await page.locator('h6:has-text("Job Titles")').waitFor();

    // Now edit the job title
    const newJobTitle = `Edited Job Title ${Date.now()}`;
    const editIcon = page.locator(`div.oxd-table-row:has-text("${originalJobTitle}") .bi-pencil-fill`);
    await editIcon.scrollIntoViewIfNeeded();
    await editIcon.click();
    await page.locator('.oxd-input').first().fill(newJobTitle);
    await page.locator('button:has-text("Save")').click();
    // Wait for edit confirmation
    await page.locator('.oxd-toast').waitFor({ state: 'visible' });

    // Verify that the job title has been edited
    const newJobTitleCell = page.locator(`div.oxd-table-cell:has-text("${newJobTitle}")`);
    await newJobTitleCell.scrollIntoViewIfNeeded();
    await expect(newJobTitleCell).toBeVisible();
    await expect(page.locator(`div.oxd-table-cell:has-text("${originalJobTitle}")`)).toHaveCount(0);
});
