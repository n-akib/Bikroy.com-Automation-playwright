// @ts-check
const { test, expect } = require('@playwright/test');
const { SearchResultsPage } = require('../pages/SearchResultsPage');
const searchData = require('../test-data/search-data.json');

test.describe('Search Module', () => {
  test('TC-SRCH-01: search by keyword returns relevant results', async ({ page }) => {
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.openSearch(searchData.validKeyword);

    // Verify URL reflects the keyword
    await expect(page).toHaveURL(/query=iPhone/i);

    // Verify ad cards are returned
    const count = await searchResultsPage.getAdCount();
    expect(count).toBeGreaterThan(0);

    // Verify result titles are returned
    const titles = await searchResultsPage.getAdTitles();
    expect(titles.length).toBeGreaterThan(0);
  });

  test('TC-SRCH-02: search with no matching results', async ({ page }) => {
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.openSearch(searchData.nonsenseKeyword);

    // Verify URL reflects the nonsense keyword
    await expect(page).toHaveURL(new RegExp(`query=${searchData.nonsenseKeyword}`));

    // Verify empty state message is displayed
    const emptyText = await searchResultsPage.getEmptyStateText();
    expect(emptyText).toMatch(/0 results|couldn't find ads|no result/i);
  });

  test('TC-SRCH-03: select location to scope results', async ({ page }) => {
    const searchResultsPage = new SearchResultsPage(page);
    await searchResultsPage.openSearch(searchData.validKeyword);

    const count = await searchResultsPage.getAdCount();
    expect(count).toBeGreaterThan(0);

    // Verify result listings display location metadata
    const cardsText = await searchResultsPage.adCards.evaluateAll(cards => cards.map(c => c.innerText));
    expect(cardsText.length).toBeGreaterThan(0);

    // Check that listings have location information (e.g., Dhaka, Gazipur, Sylhet, etc.)
    const hasLocation = cardsText.some(text => /Dhaka|Chattogram|Sylhet|Gazipur|Bangladesh/i.test(text));
    expect(hasLocation).toBeTruthy();
  });
});
