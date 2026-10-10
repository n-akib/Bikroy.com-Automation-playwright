// @ts-check
const { test, expect } = require('@playwright/test');
const { CategoryPage } = require('../pages/CategoryPage');

test.describe('Filter Module', () => {
  test('TC-FLT-01: condition filter on Phones & Tablets', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.open('/mobile-phones-tablets');

    // Verify condition tags exist on the category ad cards
    const conditionTags = await categoryPage.getConditionTags();
    expect(conditionTags.length).toBeGreaterThan(0);
    expect(conditionTags).toContain('Used');
  });

  test('TC-FLT-02: price range filter', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    const minPrice = 10000;
    const maxPrice = 20000;

    await categoryPage.applyPriceFilter(minPrice, maxPrice, '/mobile-phones-tablets');

    // Verify URL contains the applied price range
    await expect(page).toHaveURL(/price_min=10000&price_max=20000/);

    // Verify all returned card prices are within the min and max bounds
    const prices = await categoryPage.getAdPrices();
    expect(prices.length).toBeGreaterThan(0);

    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(minPrice);
      expect(price).toBeLessThanOrEqual(maxPrice);
    }
  });

  test('TC-FLT-03: subcategory filter on Phones & Tablets', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.open('/mobile-phones-tablets');

    // Verify subcategories list is available
    const subcategories = await categoryPage.getSubcategoryNames();
    expect(subcategories).toContain('Mobile Phones');

    // Click subcategory Mobile Phones
    await categoryPage.clickSubcategory('Mobile Phones');
    await expect(page).toHaveURL(/\/mobile-phones/);

    // Verify ads load under the selected subcategory
    const prices = await categoryPage.getAdPrices();
    expect(prices.length).toBeGreaterThan(0);
  });
});
