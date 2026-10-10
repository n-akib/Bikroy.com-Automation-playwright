// @ts-check
const { expect } = require('@playwright/test');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.logo = page.locator('header a[href="/"], .qa-header a[href="/"]').first();
    this.sellButton = page.locator('.qa-header-sell, a:has-text("SELL"), button:has-text("SELL")').first();
  }

  /**
   * Navigate to a relative path or absolute URL
   * @param {string} path
   */
  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'load' });
  }

  /**
   * Wait for network or load state safely
   */
  async waitForPageLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Parse BDT price text (e.g. "BDT 15,500" or "BDT 1,55,500") into an integer
   * @param {string} text
   * @returns {number | null}
   */
  parsePrice(text) {
    const match = text.match(/BDT\s([\d,]+)/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return null;
  }

  /**
   * Dismiss any popups, cookie consent banners or notifications if present
   */
  async dismissBannersIfPresent() {
    try {
      const closeBtn = this.page.locator('button[aria-label="Close"], .modal-close, .cookie-consent-accept, .banner-close').first();
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
      }
    } catch {
      // Ignore if no banner is visible
    }
  }
}

module.exports = { BasePage };
