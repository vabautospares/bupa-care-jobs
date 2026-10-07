import { test, expect } from '@playwright/test';

test.describe('Eligibility page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply/eligibility');
    await expect(page).toHaveTitle(/Start your application/);
  });

  test('loads with introduction and three options', async ({ page }) => {
    await expect(page.locator('text=Start your application')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'UK citizen' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'UK student with a visa' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Applying from another country' })).toBeVisible();
  });

  test('selecting UK citizen navigates to /apply with applicant param', async ({ page }) => {
    await page.click('text=UK citizen');
    await expect(page).toHaveURL(/\/apply\?applicant=uk-citizen/);
  });

  test('selecting overseas with role preserves role param', async ({ page }) => {
    await page.goto('/apply/eligibility?role=Care+Assistant');
    await page.click('text=Applying from another country');
    await expect(page).toHaveURL(/\/apply\?applicant=overseas&role=Care\+Assistant/);
  });

  test('Apply now CTA in nav routes through eligibility', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Apply now');
    await expect(page).toHaveURL(/\/apply\/eligibility/);
  });
});

test.describe('Apply page with applicant type', () => {
  test('shows "You\'re applying as" when applicant param is present', async ({ page }) => {
    await page.goto('/apply?applicant=uk-citizen');
    await expect(page.locator('text=You\'re applying as: UK citizen')).toBeVisible();
  });

  test('shows no heading when applicant param is missing', async ({ page }) => {
    await page.goto('/apply');
    await expect(page.locator('text=You\'re applying as')).not.toBeVisible();
  });
});
