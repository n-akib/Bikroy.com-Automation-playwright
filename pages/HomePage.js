// @ts-check
const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.searchContainer = page.locator('.b-main-page-header__search-input, .fw-search').first();
    this.searchPlaceholder = page.locator('.fw-search__placeholder').first();
    this.locationSelector = page.locator('.qa-choose-region-button, button:has-text("All Bangladesh")').first();
    this.categoryLinks = page.locator('.b-main-page a[href^="/"], a:has([class*="category"])');
    this.trendingSection = page.locator('text=Trending ads').first();
    this.adCards = page.locator('.b-advert-listing, .b-advert-item').or(page.locator('a').filter({ hasText: 'BDT' }));
    this.langToggle = page.locator('.b-language-selector, .qa-lang-switcher').first();
  }

  async open() {
    await this.goto('/');
    await this.waitForPageLoaded();
    await this.page.locator('.b-main-page a[href^="/"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  /**
   * Get all visible category names on the homepage
   * @returns {Promise<string[]>}
   */
  async getCategoryNames() {
    const rawTexts = await this.categoryLinks.evaluateAll(links => {
      return links.map(l => l.innerText.split('\n')[0].trim()).filter(Boolean);
    });
    return [...new Set(rawTexts)];
  }

  /**
   * Click on a category by name or url path
   * @param {string} categoryName
   * @param {string} [urlPath]
   */
  async clickCategory(categoryName, urlPath) {
    const selector = urlPath
      ? `a[href="${urlPath}"]`
      : `.b-main-page a:has-text("${categoryName}")`;
    const link = this.page.locator(selector).first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    await link.click();
    await this.waitForPageLoaded();
  }

  /**
   * Get the count of trending / homepage ad cards
   * @returns {Promise<number>}
   */
  async getAdCardCount() {
    await this.trendingSection.scrollIntoViewIfNeeded().catch(() => {});
    await this.adCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.adCards.count();
  }

  /**
   * Extract price strings from all visible ad cards
   * @returns {Promise<string[]>}
   */
  async getAdCardPriceTexts() {
    await this.trendingSection.scrollIntoViewIfNeeded().catch(() => {});
    await this.adCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.adCards.evaluateAll(cards => {
      return cards.map(c => {
        const match = c.innerText.match(/BDT\s[\d,]+/);
        return match ? match[0] : null;
      }).filter(Boolean);
    });
  }

  /**
   * Get current HTML lang attribute
   * @returns {Promise<string | null>}
   */
  async getHtmlLang() {
    return await this.page.locator('html').getAttribute('lang');
  }
}

module.exports = { HomePage };
