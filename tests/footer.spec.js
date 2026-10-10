// @ts-check
const { test, expect } = require('@playwright/test');
const { FooterPage } = require('../pages/FooterPage');
const footerLinksData = require('../test-data/footer-links.json');

test.describe('Footer Module', () => {
  for (const link of footerLinksData) {
    test(`TC-FOOT-01: footer link "${link.title}" opens correct page`, async ({ page }) => {
      const footerPage = new FooterPage(page);
      const response = await footerPage.open(link.urlPath);
      
      // Verify HTTP 200 response
      expect(response?.status()).toBe(200);

      // Verify URL matches expected path
      await expect(page).toHaveURL(new RegExp(link.urlPath));

      // Verify a heading exists and is visible on the page
      await expect(footerPage.heading).toBeVisible();
      const headingText = await footerPage.getPageHeadingText();
      expect(headingText.length).toBeGreaterThan(0);
    });
  }
});
