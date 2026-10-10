// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

test.describe('Navigation Module', () => {
  test('TC-NAV-01: browser back restores the previous page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    // Verify initial homepage state
    await expect(homePage.sellButton).toBeVisible();

    // Click category Phones & Tablets
    await homePage.clickCategory('Phones & Tablets', '/mobile-phones-tablets');
    await expect(page).toHaveURL(/\/mobile-phones-tablets/);

    // Navigate back using browser history
    await page.goBack();
    await homePage.waitForPageLoaded();

    // Verify returning to homepage
    await expect(page).toHaveURL(/bikroy\.com\/?$/);
    await expect(homePage.sellButton).toBeVisible();
    await expect(homePage.searchContainer).toBeVisible();
  });
});
