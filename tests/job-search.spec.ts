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

  test('vacancy cards show a pay range', async ({ page }) => {
    await expect(page.locator('article.card').first()).toContainText('£17.00 – £18.60 per hour');
    await expect(page.getByText('Pay shown is an indicative range for each role in the UK')).toBeVisible();
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

  test('Apply now button on result cards links to eligibility with role param', async ({ page }) => {
    await page.fill('input[name="keyword"]', 'Care Assistant');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/find-opportunities\?keyword=Care\+Assistant/);
    await expect(page.locator('[aria-label="Active filters"]')).toBeVisible();

    const applyLink = page.locator('article >> text=Apply now').first();
    await applyLink.scrollIntoViewIfNeeded();
    await applyLink.evaluate((el) => {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, offsetTop - window.innerHeight / 2),
        behavior: "instant",
      });
    });
    await applyLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/apply\/eligibility\?role=/);
  });
});