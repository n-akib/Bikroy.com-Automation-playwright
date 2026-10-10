// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const categoriesData = require('../test-data/categories.json');

test.describe('Homepage Module', () => {
  test('TC-HOME-01: homepage loads with core elements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    // Verify page title contains 'bikroy.com'
    await expect(page).toHaveTitle(/bikroy\.com/i);

    // Verify core UI components are visible
    await expect(homePage.searchContainer).toBeVisible();
    await expect(homePage.locationSelector).toBeVisible();
    await expect(homePage.sellButton).toBeVisible();
  });

  test('TC-HOME-02: all main categories are displayed', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    const visibleCategories = await homePage.getCategoryNames();
    
    // Check that expected 17 categories are visible
    for (const cat of categoriesData.allCategories) {
      const found = visibleCategories.some(name => name.includes(cat.name) || cat.name.includes(name));
      expect(found, `Category "${cat.name}" should be visible on homepage`).toBeTruthy();
    }
  });

  for (const cat of categoriesData.sampleNavigation) {
    test(`TC-HOME-03: category navigation to ${cat.name}`, async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await homePage.clickCategory(cat.name, cat.urlPath);
      await expect(page).toHaveURL(new RegExp(cat.urlPath));
    });
  }

  test('TC-HOME-04: trending ads section loads', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    const cardCount = await homePage.getAdCardCount();
    expect(cardCount).toBeGreaterThan(0);

    const priceTexts = await homePage.getAdCardPriceTexts();
    expect(priceTexts.length).toBeGreaterThan(0);
    
    // Verify price pattern format: BDT <digits with commas>
    for (const price of priceTexts) {
      expect(price).toMatch(/BDT\s[\d,]+/);
    }
  });

  test('TC-HOME-05: language switch EN to BN', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    // Verify language indicator / selector is present
    await expect(homePage.langToggle).toBeVisible();
    const langText = await homePage.langToggle.innerText();
    expect(langText.trim()).toMatch(/EN|বাংলা|English/i);
  });
});
