import { test, expect } from '@playwright/test';

const navLinks = [
  { label: 'Find opportunities', href: '/find-opportunities' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Care careers', href: '/care-careers' },
  { label: 'About us', href: '/about' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const link of navLinks) {
    test(`navigates to ${link.label}`, async ({ page }) => {
      await page.click(`nav >> text=${link.label}`);
      await expect(page).toHaveURL(new RegExp(link.href));
    });
  }

  test('Apply now button in header navigates to /apply', async ({ page }) => {
    await page.click('nav >> text=Apply now');
    await expect(page).toHaveURL('/apply');
  });

  test('footer navigation links work', async ({ page }) => {
    for (const link of navLinks) {
      await page.click(`footer >> text=${link.label}`);
      await expect(page).toHaveURL(new RegExp(link.href));
      await page.goto('/');
    }
  });

  test('footer legal links work', async ({ page }) => {
    const legalLinks = [
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Privacy Notice', href: '/privacy-notice' },
      { label: 'Cookie Information', href: '/cookie-information' },
      { label: 'Accessibility', href: '/accessibility' },
    ];

    for (const link of legalLinks) {
      await page.click(`footer >> text=${link.label}`);
      await expect(page).toHaveURL(new RegExp(link.href));
      await page.goto('/');
    }
  });

  test('Home link in footer navigates to homepage', async ({ page }) => {
    await page.click('footer >> text=Care Careers');
    await expect(page).toHaveURL('/');
  });
});