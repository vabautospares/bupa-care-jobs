import { test, expect } from '@playwright/test';

test.describe('Apply page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply');
    await expect(page).toHaveTitle(/Apply/);
  });

  test('shows all form sections', async ({ page }) => {
    await expect(page.locator('text=Start your application')).toBeVisible();
    await expect(page.locator('text=Job preferences')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
    await expect(page.locator('text=Choose your recruitment & sponsorship support')).toBeVisible();
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
    await page.fill('input[name="yearsExperience"]', '-1');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Enter your years of experience.')).toBeVisible();
  });

  test('service plan selection is required', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Select a recruitment support term.')).toBeVisible();
  });

  test('terms acceptance is required', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=You must accept the Terms & Conditions.')).toBeVisible();
  });

  test('selecting a plan clears plan selection error', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Select a recruitment support term.')).toBeVisible();

    await page.click('label:has-text("3-Year Recruitment & Sponsorship Support")');

    await expect(page.locator('text=Select a recruitment support term.')).not.toBeVisible();
  });

  test('Terms link has correct href', async ({ page }) => {
    const link = page.locator('#terms a[href="/terms-and-conditions"]');
    await expect(link).toHaveAttribute('href', '/terms-and-conditions');
    await expect(link).toHaveAttribute('target', '_blank');
  });
});