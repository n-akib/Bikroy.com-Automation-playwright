// @ts-check
const { BasePage } = require('./BasePage');

class FooterPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.footerLinks = page.locator('footer a');
    this.heading = page.locator('h1, h2').first();
  }

  /**
   * Navigate to a footer page
   * @param {string} path
   */
  async open(path) {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoaded();
    return response;
  }

  /**
   * Click a specific link in the footer by text
   * @param {string} linkText
   */
  async clickFooterLink(linkText) {
    const link = this.footerLinks.filter({ hasText: linkText }).first();
    await link.click();
    await this.waitForPageLoaded();
  }

  /**
   * Get main heading text from the current page
   * @returns {Promise<string>}
   */
  async getPageHeadingText() {
    return (await this.heading.innerText()).trim();
  }
}

module.exports = { FooterPage };
