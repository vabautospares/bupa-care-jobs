import { test, expect } from '@playwright/test';

test.describe('Recruitment process page', () => {
  test('loads and shows the key sections', async ({ page }) => {
    const response = await page.goto('/recruitment-process');
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Our Recruitment Process/);
    await expect(page.locator('h1')).toHaveText('Our recruitment process');

    await expect(page.getByRole('heading', { name: 'Registering and our application process', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Registering', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your profile', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Job search', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Applying for a job', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Application process', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Help', level: 2 })).toBeVisible();
  });

  test('asks applicants to send documents by email rather than upload them', async ({ page }) => {
    await page.goto('/recruitment-process');

    await expect(page.getByText('We ask you to send a copy of your CV when applying')).toBeVisible();
    await expect(page.getByText('you can also send your CV, certificates and any other supporting documents')).toBeVisible();
    await expect(page.getByText(/upload a copy of your CV/)).toHaveCount(0);
  });

  test('shows both support plan options and the deposit wording', async ({ page }) => {
    await page.goto('/recruitment-process');

    await expect(page.locator('text=3-Year Recruitment & Sponsorship Support')).toBeVisible();
    await expect(page.locator('text=5-Year Recruitment & Sponsorship Support')).toBeVisible();
    await expect(page.locator('text=A deposit of £1,000 is due before application review.')).toBeVisible();
  });

  test('page CTA points at the opportunities search', async ({ page }) => {
    await page.goto('/recruitment-process');

    const cta = page.getByRole('link', { name: 'View available opportunities' });
    await expect(cta).toHaveAttribute('href', '/find-opportunities');
  });

  test('/how-it-works redirects to /recruitment-process', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page).toHaveURL('/recruitment-process');
    await expect(page.locator('h1')).toHaveText('Our recruitment process');
  });
});
