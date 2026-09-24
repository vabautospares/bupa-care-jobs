import { test, expect } from '@playwright/test';

test.describe('Homepage smoke test', () => {
  test('loads successfully and shows key elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bupa Care Jobs/);

    await expect(page.locator('h1')).toContainText('Find opportunities to work in care');

    await expect(page.locator('text=Find opportunities to work in care')).toBeVisible();

    await expect(page.getByRole('link', { name: 'Care Assistant Support people' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Senior Care Assistant Guide' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Healthcare Assistant Work' })).toBeVisible();

    await expect(page.locator('text=3-Year Recruitment & Sponsorship Support')).toBeVisible();
    await expect(page.locator('text=5-Year Recruitment & Sponsorship Support')).toBeVisible();

    await expect(page.locator('footer')).toBeVisible();
  });
});