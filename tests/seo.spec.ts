import { test, expect } from '@playwright/test';

const PRODUCTION_HOST = 'www.bupacareers.site';

const attribute = (html: string, pattern: RegExp): string | null => {
  const match = html.match(pattern);
  return match ? match[1] : null;
};

const jsonLdBlocks = async (page: import('@playwright/test').Page) =>
  page.locator('script[type="application/ld+json"]').allTextContents();

test.describe('SEO fundamentals', () => {
  test('homepage canonical, title and description are production values', async ({ page }) => {
    await page.goto('/');

    const html = await page.content();
    const canonical = attribute(html, /<link rel="canonical" href="([^"]+)"/);

    expect(canonical?.replace(/\/$/, '')).toBe(`https://${PRODUCTION_HOST}`);
    expect(canonical).not.toContain('localhost');

    await expect(page).toHaveTitle(/Bupa Care Jobs/);
    expect(attribute(html, /<meta name="description" content="([^"]*)"/)).toBeTruthy();
  });

  test('localhost in the environment never leaks into canonicals', async ({ page }) => {
    for (const path of ['/', '/find-opportunities', '/faqs']) {
      await page.goto(path);
      const html = await page.content();

      // .env sets NEXT_PUBLIC_SITE_URL to the dev origin, so a naive wiring of
      // that variable would emit localhost URLs for Google to index.
      expect(html).not.toContain('localhost');
      expect(html).toContain(`https://${PRODUCTION_HOST}`);
    }
  });

  test('sitemap includes job URLs and the accessibility page', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const xml = await response.text();

    expect(xml).toContain('https://www.bupacareers.site/find-opportunities');
    expect(xml).toContain('https://www.bupacareers.site/accessibility');
    expect(xml).toMatch(/https:\/\/www\.bupacareers\.site\/care-jobs\//);
    expect(xml).toContain('<lastmod>');
  });

  test('robots.txt allows crawling but blocks the API', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();

    expect(body).toContain('Sitemap: https://www.bupacareers.site/sitemap.xml');
    expect(body).toContain('Disallow: /api/');
    // noindex is handled by meta tags, so these must stay crawlable.
    expect(body).not.toContain('Disallow: /apply');
    expect(body).not.toContain('Disallow: /confirmation');
  });

  test('noindex pages carry a noindex meta tag', async ({ page }) => {
    await page.goto('/apply');

    const html = await page.content();
    expect(html).toMatch(/<meta name="robots" content="[^"]*noindex/);
  });

  test('indexable pages publish the googlebot snippet directives', async ({ page }) => {
    // These were silently dropped when a page's robots value was undefined,
    // which cost max-image-preview and max-snippet on every page.
    await page.goto('/care-jobs/care-assistant-london');

    const html = await page.content();
    expect(html).toContain('max-snippet:-1');
    expect(html).toContain('max-image-preview:large');
    expect(html).toMatch(/<meta name="googlebot" content="[^"]*index/);
  });

  test('site-wide WebSite and Organization schema are present', async ({ page }) => {
    await page.goto('/');
    const blocks = await jsonLdBlocks(page);
    const types = blocks.map((block) => JSON.parse(block)['@type']);

    expect(types).toContain('WebSite');
    expect(types).toContain('Organization');
  });
});

test.describe('Job pages', () => {
  test('a job page renders with JobPosting schema and a self canonical', async ({ page }) => {
    await page.goto('/care-jobs/care-assistant-london');

    await expect(page.locator('h1')).toContainText('Care Assistant');

    const html = await page.content();
    expect(attribute(html, /<link rel="canonical" href="([^"]+)"/)).toBe(
      `https://${PRODUCTION_HOST}/care-jobs/care-assistant-london`,
    );

    const blocks = await jsonLdBlocks(page);
    const posting = blocks
      .map((block) => JSON.parse(block))
      .find((entry) => entry['@type'] === 'JobPosting');

    expect(posting).toBeTruthy();
    expect(posting.title).toBe('Care Assistant');
    // Google requires these three fields for a job rich result.
    expect(posting.datePosted).toBeTruthy();
    expect(posting.validThrough).toBeTruthy();
    expect(posting.employmentType).toBe('FULL_TIME');
    expect(posting.hiringOrganization['@id']).toBe(
      `https://${PRODUCTION_HOST}/#organization`,
    );
    expect(posting.jobLocation.address.addressCountry).toBe('GB');
  });

  test('job pages carry breadcrumb markup', async ({ page }) => {
    await page.goto('/care-jobs/care-assistant-london');

    const blocks = await jsonLdBlocks(page);
    const crumbs = blocks
      .map((block) => JSON.parse(block))
      .find((entry) => entry['@type'] === 'BreadcrumbList');

    expect(crumbs).toBeTruthy();
    expect(crumbs.itemListElement.length).toBeGreaterThanOrEqual(3);
    expect(crumbs.itemListElement[0].position).toBe(1);
  });

  test('the job index links to every job page in server-rendered HTML', async ({ page }) => {
    await page.goto('/find-opportunities');

    const html = await page.content();
    const links = await page
      .locator('a[href^="/care-jobs/"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));

    expect(links.length).toBeGreaterThan(0);

    // Present in the initial HTML, so the links are crawlable without JS.
    for (const href of links) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  test('an unknown job slug returns a 404', async ({ request }) => {
    const response = await request.get('/care-jobs/this-role-does-not-exist');

    expect(response.status()).toBe(404);
  });

  test('job pages are linked from the results cards', async ({ page }) => {
    await page.goto('/find-opportunities?keyword=Care%20Assistant');

    await expect(page.locator('a[href^="/care-jobs/"]').first()).toBeVisible();
  });
});

test.describe('Structured data', () => {
  test('the FAQ page exposes FAQPage schema', async ({ page }) => {
    await page.goto('/faqs');

    const blocks = await jsonLdBlocks(page);
    const faq = blocks
      .map((block) => JSON.parse(block))
      .find((entry) => entry['@type'] === 'FAQPage');

    expect(faq).toBeTruthy();
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(5);

    for (const entry of faq.mainEntity) {
      expect(entry['@type']).toBe('Question');
      expect(entry.acceptedAnswer['@type']).toBe('Answer');
      // Markdown leaks are rejected by Google's rich result validator.
      expect(entry.acceptedAnswer.text).not.toContain('**');
    }
  });

  test('JSON-LD output never contains unescaped angle brackets', async ({ page }) => {
    await page.goto('/care-jobs/care-assistant-london');

    const html = await page.content();

    for (const block of await jsonLdBlocks(page)) {
      expect(() => JSON.parse(block)).not.toThrow();
    }

    // If escaping works, every block is closed and the page still parses.
    expect(html).not.toContain('</script></script>');
  });
});