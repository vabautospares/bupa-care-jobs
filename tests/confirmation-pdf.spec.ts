import { test, expect } from '@playwright/test';

const confirmationData = {
  ref: 'test-id',
  plan: 'three-year',
  role: 'Care Assistant',
  applicantType: 'uk-citizen',
  submittedAt: new Date().toISOString(),
  fullName: 'Alex Smith',
  email: 'alex@example.com',
  phone: '+447700900123',
  whatsapp: '+447700900123',
  country: 'United Kingdom',
  ukLocation: 'London',
  preferredLocation: 'London',
  workType: 'Care home',
  employmentPreference: 'Full-time',
  availability: 'Immediately',
  careExperience: true,
  yearsExperience: 3,
  qualifications: 'Care certificate',
  employmentStatus: 'Employed',
};

test.describe('Confirmation PDF', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('shows PDF download button on confirmation page', async ({ page }) => {
    await page.addInitScript((data) => {
      sessionStorage.setItem('bupa-application-confirmation', JSON.stringify(data));
    }, confirmationData);
    await page.goto('/confirmation?ref=test-id&plan=three-year&role=Care+Assistant');
    await expect(page.locator('text=Download application as PDF')).toBeVisible();
  });

  test('PDF download triggers a file download', async ({ page }) => {
    await page.addInitScript((data) => {
      sessionStorage.setItem('bupa-application-confirmation', JSON.stringify(data));
    }, confirmationData);
    await page.goto('/confirmation?ref=test-id&plan=three-year&role=Care+Assistant');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Download application as PDF'),
    ]);
    expect(download.suggestedFilename()).toBe('Bupa-Application-test-id.pdf');
  });
});
