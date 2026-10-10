// @ts-check
const { BasePage } = require('./BasePage');

class CategoryPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.filterWrapper = page.locator('.b-filters-wrapper').first();
    this.minPriceInput = page.locator('input.qa-min-price').first();
    this.maxPriceInput = page.locator('input.qa-max-price').first();
    this.savePriceButton = page.locator('.qa-range-save').first();
    this.clearPriceButton = page.locator('.b-filter-attribute-range__button--grey, button:has-text("CLEAR")').first();
    this.adCards = page.locator('.b-advert-listing, .b-advert-item').or(page.locator('a').filter({ hasText: 'BDT' }));
    this.subcategories = page.locator('.b-filters-wrapper a');
    this.locationFilter = page.locator('.b-filters-wrapper').getByText(/All Bangladesh|Location/i).first();
  }

  /**
   * Open a specific category page
   * @param {string} path
   */
  async open(path = '/mobile-phones-tablets') {
    await this.goto(path);
    await this.waitForPageLoaded();
    await this.filterWrapper.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  /**
   * Apply a price filter either by query params or UI
   * @param {number} min
   * @param {number} max
   */
  async applyPriceFilter(min, max, categoryPath = '/mobile-phones-tablets') {
    await this.goto(`${categoryPath}?price_min=${min}&price_max=${max}`);
    await this.waitForPageLoaded();
    await this.adCards.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  /**
   * Get parsed integer prices for all visible ad cards
   * @returns {Promise<number[]>}
   */
  async getAdPrices() {
    await this.adCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.adCards.evaluateAll(cards => {
      return cards.map(c => {
        const match = c.innerText.match(/BDT\s([\d,]+)/);
        return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
      }).filter(p => p !== null);
    });
  }

  /**
   * Get condition tags from ad cards (e.g. 'Used', 'Brand New', 'Refurbished')
   * @returns {Promise<string[]>}
   */
  async getConditionTags() {
    return await this.adCards.evaluateAll(cards => {
      const conditionSet = new Set();
      cards.forEach(c => {
        if (/Used/i.test(c.innerText)) conditionSet.add('Used');
        if (/Brand New/i.test(c.innerText)) conditionSet.add('Brand New');
        if (/Refurbished/i.test(c.innerText)) conditionSet.add('Refurbished');
      });
      return Array.from(conditionSet);
    });
  }

  /**
   * Get all visible subcategory names
   * @returns {Promise<string[]>}
   */
  async getSubcategoryNames() {
    return await this.subcategories.evaluateAll(links => {
      return links.map(l => l.innerText.split('\n')[0].trim()).filter(Boolean);
    });
  }

  /**
   * Click a subcategory link by name
   * @param {string} name
   */
  async clickSubcategory(name) {
    const link = this.subcategories.filter({ hasText: name }).first();
    await link.click();
    await this.waitForPageLoaded();
  }
}

module.exports = { CategoryPage };
