import { test, expect, type Page } from '@playwright/test';

const fillCompleteApplication = async (page: Page) => {
  await page.route('**/api/opportunities**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        opportunities: [
          {
            id: '1',
            title: 'Care Assistant',
            location: 'London',
            description: 'Support residents with daily routines.',
            category: 'care-assistant',
            employmentType: 'Full-time',
            availability: 'Immediate',
            active: true,
          },
        ],
      }),
    }),
  );

  await page.route('**/api/applications**', (route) =>
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Application submitted successfully.', applicationId: 'test-id' }),
    }),
  );

  await page.goto('/apply');
  await expect(page.locator('select[name="role"] option')).toHaveCount(2);

  await page.fill('input[name="fullName"]', 'Alex Smith');
  await page.fill('input[name="email"]', 'alex@example.com');
  await page.fill('input[name="phone"]', '7700900123');
  await page.fill('input[name="whatsapp"]', '07700900123');
  await page.fill('input[name="country"]', 'United Kingdom');
  await page.fill('input[name="preferredLocation"]', 'London');
  await page.fill('input[name="availability"]', '2 weeks');
  await page.fill('textarea[name="qualifications"]', 'Care certificate');
  await page.fill('input[name="employmentStatus"]', 'Employed');
  await page.selectOption('select[name="role"]', { index: 1 });
  await page.selectOption('select[name="workType"]', { index: 1 });
  await page.selectOption('select[name="employmentPreference"]', { index: 1 });
  await page.check('input[name="termsAccepted"]');
  await page.click('label:has-text("3-Year Recruitment & Sponsorship Support")');
};

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

  test('phone and WhatsApp show a fixed +44 prefix the applicant cannot type into', async ({ page }) => {
    await expect(page.getByText('+44', { exact: true })).toHaveCount(2);

    const phone = page.locator('input[name="phone"]');
    await expect(phone).toHaveAttribute('type', 'tel');

    await fillCompleteApplication(page);

    const request = page.waitForRequest((r) => r.url().includes('/api/applications') && r.method() === 'POST');
    await page.click('button[type="submit"]');
    const body = JSON.parse((await request).postData() ?? '{}');

    expect(body.phone).toBe('+447700900123');
    expect(body.whatsapp).toBe('+447700900123');
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