import { test, expect } from '@playwright/test';

test.describe('Homepage smoke test', () => {
  test('loads successfully and shows key elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Care Careers/);

    await expect(page.locator('h1')).toContainText('Find opportunities to work in care');

    await expect(page.locator('text=Find opportunities')).toBeVisible();

    await expect(page.locator('text=Care Assistant')).toBeVisible();
    await expect(page.locator('text=Senior Care Assistant')).toBeVisible();
    await expect(page.locator('text=Support Worker')).toBeVisible();

    await expect(page.locator('text=3-year service plan')).toBeVisible();
    await expect(page.locator('text=5-year service plan')).toBeVisible();

    await expect(page.locator('footer')).toBeVisible();
  });
});