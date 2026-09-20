import { test, expect } from '@playwright/test';

test.describe('Apply page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply');
    await expect(page).toHaveTitle(/Apply/);
  });

  test('shows all form sections', async ({ page }) => {
    await expect(page.locator('text=Personal details')).toBeVisible();
    await expect(page.locator('text=Which role are you interested in?')).toBeVisible();
    await expect(page.locator('text=Your care experience')).toBeVisible();
    await expect(page.locator('text=Choose your support plan')).toBeVisible();
    await expect(page.locator('text=Review and accept')).toBeVisible();
  });

  test('submitting empty form shows validation errors', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=This field is required.')).toHaveCount(11);
  });

  test('invalid email shows error', async ({ page }) => {
    await page.fill('input[name="email"]', 'not-an-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Enter a valid email address.')).toBeVisible();
  });

  test('invalid phone numbers show errors', async ({ page }) => {
    await page.fill('input[name="phone"]', '123');
    await page.fill('input[name="whatsapp"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Enter a valid phone number.')).toBeVisible();
    await expect(page.locator('text=Enter a valid WhatsApp number.')).toBeVisible();
  });

  test('care experience checkbox reveals years field validation', async ({ page }) => {
    await page.check('input[name="careExperience"]');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Enter your years of experience.')).toBeVisible();
  });

  test('years of experience must be a valid number when care experience is checked', async ({ page }) => {
    await page.check('input[name="careExperience"]');
    await page.fill('input[name="yearsExperience"]', 'abc');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Enter your years of experience.')).toBeVisible();
  });

  test('service plan selection is required', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Select a service plan.')).toBeVisible();
  });

  test('terms acceptance is required', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=You must accept the Terms & Conditions.')).toBeVisible();
  });

  test('selecting a plan and filling required fields clears errors on re-submit', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Select a service plan.')).toBeVisible();

    await page.check('input[value="three-year"]');
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '07123456789');
    await page.fill('input[name="whatsapp"]', '07123456789');
    await page.fill('input[name="country"]', 'United Kingdom');
    await page.fill('input[name="role"]', 'Care Assistant');
    await page.fill('input[name="preferredLocation"]', 'London');
    await page.selectOption('select[name="workType"]', 'Care home');
    await page.selectOption('select[name="employmentPreference"]', 'Full-time');
    await page.fill('input[name="availability"]', 'Immediately');
    await page.fill('input[name="qualifications"]', 'NVQ Level 2');
    await page.fill('input[name="employmentStatus"]', 'Employed');
    await page.check('input[name="termsAccepted"]');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Application service is not configured yet.')).toBeVisible();
  });

  test('Terms link navigates to terms page', async ({ page }) => {
    await page.click('a[href="/terms-and-conditions"]');
    await expect(page).toHaveURL('/terms-and-conditions');
  });
});