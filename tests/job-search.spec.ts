import { test, expect } from '@playwright/test';

test.describe('Job search flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/find-opportunities');
    await expect(page).toHaveTitle(/Find Care Jobs/);
  });

  test('shows search form and results section', async ({ page }) => {
    await expect(page.locator('text=Search care opportunities')).toBeVisible();
    await expect(page.locator('input[name="keyword"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
  });

  test('empty search shows validation message', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Enter a job title, keyword or location to start your search.')).toBeVisible();
  });

  test('keyword search navigates with query params', async ({ page }) => {
    await page.fill('input[name="keyword"]', 'Care Assistant');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/find-opportunities\?keyword=Care\+Assistant/);
  });

  test('location search navigates with query params', async ({ page }) => {
    await page.fill('input[name="location"]', 'London');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/find-opportunities\?location=London/);
  });

  test('combined search navigates with both params', async ({ page }) => {
    await page.fill('input[name="keyword"]', 'Nurse');
    await page.fill('input[name="location"]', 'Manchester');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/find-opportunities\?keyword=Nurse&location=Manchester/);
  });

  test('category links from homepage navigate with category param', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href*="category=care-assistant"]');
    await expect(page).toHaveURL(/\/find-opportunities\?category=care-assistant/);
  });

  test('results section handles empty state', async ({ page }) => {
    await page.fill('input[name="keyword"]', 'NonExistentRole12345');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=No opportunities match this search')).toBeVisible();
  });

  test('clear search link resets the page', async ({ page }) => {
    await page.fill('input[name="keyword"]', 'Care Assistant');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/find-opportunities\?keyword=Care\+Assistant/);

    await page.click('text=Clear search');
    await expect(page).toHaveURL('/find-opportunities');
  });

  test('Apply now button on result cards links to /apply with role param', async ({ page }) => {
    await page.fill('input[name="keyword"]', 'Care Assistant');
    await page.click('button[type="submit"]');

    await page.waitForSelector('text=Apply now', { timeout: 10000 });
    await page.click('text=Apply now');
    await expect(page).toHaveURL(/\/apply\?role=/);
  });
});