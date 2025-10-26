import { test, expect, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();



/* test.beforeEach(async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
}); */

const username = process.env.ORANGE_HRM_USERNAME;
if (!username) throw new Error('USERNAME not set');
const password = process.env.ORANGE_HRM_PASSWORD;
if (!password) throw new Error('PASSWORD not set');

// Positive login test
test('login test', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Additional wait for dynamic content
  // Fill in username
  await page.locator('input[name="username"]').fill(username);

  // Fill in password
  await page.locator('input[name="password"]').fill(password);

  // Click login button
  await page.locator('button[type="submit"]').click();

  // Expect to be logged in by checking for the presence of the dashboard
  await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();

});


const invalidUsername = process.env.ORANGE_HRM_INVALID_USERNAME;
if (!invalidUsername) throw new Error('INVALID USERNAME not set');
const invalidPassword = process.env.ORANGE_HRM_INVALID_PASSWORD;
if (!invalidPassword) throw new Error('INVALID PASSWORD not set');

// Negative login test for invalid username
test('negative login test for invalid username', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Additional wait for dynamic content
  // Fill in invalid username
  await page.locator('input[name="username"]').fill(invalidUsername);

  // Fill in valid password
  await page.locator('input[name="password"]').fill(password);

  // Click login button
  await page.locator('button[type="submit"]').click();

  // Expect an error message to be visible
  await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
});

// Negative login test for invalid password
test('negative login test for invalid password', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Additional wait for dynamic content
  // Fill in valid username
  await page.locator('input[name="username"]').fill(username);

  // Fill in invalid password
  await page.locator('input[name="password"]').fill(invalidPassword);

  // Click login button
  await page.locator('button[type="submit"]').click();

  // Expect an error message to be visible
  await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
});

// Negative login test for empty credentials
test('negative login test for empty credentials', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Additional wait for dynamic content
  // Leave username and password fields empty

  // Click login button
  await page.locator('button[type="submit"]').click();

  // Expect an error message to be visible
  await expect(page.locator('.oxd-input-field-error-message')).toBeVisible();
});
