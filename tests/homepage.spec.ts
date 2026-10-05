import { test, expect } from '@playwright/test';

test.describe('Homepage smoke test', () => {
  test('loads successfully and shows key elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bupa Care Jobs/);

    await expect(page.locator('h1')).toContainText('Find opportunities to work in care');

    await expect(page.locator('text=Find opportunities to work in care')).toBeVisible();

    await expect(page.getByRole('link', { name: /^Care Assistant/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /^Senior Care Assistant/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /^Healthcare Assistant/ })).toBeVisible();

    await expect(page.locator('text=3-Year Recruitment & Sponsorship Support')).toBeVisible();
    await expect(page.locator('text=5-Year Recruitment & Sponsorship Support')).toBeVisible();

    await expect(page.getByRole('link', { name: /^Care Assistant/ })).toContainText('£17.00 – £18.60 per hour');
    await expect(page.getByRole('link', { name: /^Registered Nurse/ })).toContainText('£27.20 – £33.20 per hour');
    await expect(page.getByText('Pay shown is an indicative range for each role in the UK')).toBeVisible();

    await expect(page.locator('footer')).toBeVisible();
  });
});