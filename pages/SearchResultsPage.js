// @ts-check
const { BasePage } = require('./BasePage');

class SearchResultsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/Type your search here/i).or(page.locator('input[type="text"]').first());
    this.adCards = page.locator('.b-advert-listing, .b-advert-item').or(page.locator('a').filter({ hasText: 'BDT' }));
    this.emptyStateMessage = page.locator('text=/0 results|couldn\'t find ads|no result/i').first();
  }

  /**
   * Navigate to search results with a query
   * @param {string} keyword
   */
  async openSearch(keyword) {
    await this.goto(`/search?query=${encodeURIComponent(keyword)}`);
    await this.waitForPageLoaded();
    await Promise.race([
      this.adCards.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
      this.emptyStateMessage.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
    ]);
  }

  /**
   * Get all card titles or headings from the search results
   * @returns {Promise<string[]>}
   */
  async getAdTitles() {
    return await this.adCards.evaluateAll(cards => {
      return cards.map(c => {
        const lines = c.innerText.split('\n').map(l => l.trim()).filter(Boolean);
        // Usually the second line or first non-category line is the title
        return lines.length > 1 ? lines[1] : lines[0];
      }).filter(Boolean);
    });
  }

  /**
   * Get the count of returned ad cards
   * @returns {Promise<number>}
   */
  async getAdCount() {
    await this.adCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.adCards.count();
  }

  /**
   * Get the empty state notification text
   * @returns {Promise<string>}
   */
  async getEmptyStateText() {
    return await this.emptyStateMessage.innerText();
  }
}

module.exports = { SearchResultsPage };
