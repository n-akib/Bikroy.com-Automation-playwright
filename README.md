# Bikroy.com UI Test Automation Framework

An end-to-end UI test automation framework for [Bikroy.com](https://bikroy.com), Bangladesh's largest online classifieds marketplace. Built with [Playwright](https://playwright.dev/) and the Page Object Model (POM) pattern in JavaScript (CommonJS).

---

## 📋 Features & Capabilities

- **Page Object Model (POM):** Clean separation between page elements, user actions, and test assertions.
- **Data-Driven Testing:** Test fixtures and dataset parameters loaded from `test-data/*.json`.
- **Web-First Assertions:** Uses resilient, auto-retrying Playwright assertions (`toBeVisible`, `toHaveURL`, `toContainText`) with zero arbitrary `waitForTimeout` calls.
- **Dynamic Site Resilience:** Strips currency symbols (`BDT`) and Indian-numbering commas (`1,55,500`) to assert mathematical boundaries rather than volatile ad titles/prices.
- **HTML & List Reporting:** Generates comprehensive test execution reports with traces, screenshots, and videos on failure.

---

## 🏗️ Repository Structure

```
Bikroy_Automation/
├── pages/                  # Page Object classes
│   ├── BasePage.js         # Common methods, navigation, banners & price parser
│   ├── HomePage.js         # Header, categories, trending ads, language selector
│   ├── CategoryPage.js     # Category listings, price range & condition filters
│   ├── SearchResultsPage.js# Search queries, result cards & empty state checks
│   └── FooterPage.js       # Footer links verification & status checks
├── tests/                  # Playwright test specs (mapped to TC IDs)
│   ├── home.spec.js        # TC-HOME-01 to TC-HOME-05
│   ├── search.spec.js      # TC-SRCH-01 to TC-SRCH-03
│   ├── filter.spec.js      # TC-FLT-01 to TC-FLT-03
│   ├── navigation.spec.js  # TC-NAV-01
│   └── footer.spec.js      # TC-FOOT-01
├── test-data/              # Data-driven JSON datasets
│   ├── categories.json     # Category lists and sample navigation paths
│   ├── search-data.json    # Valid/invalid keywords and locations
│   └── footer-links.json   # Footer paths and expected link titles
├── playwright.config.js    # Playwright configuration & Chromium profile
├── package.json            # Project dependencies & scripts
├── bikroy_test_cases.xlsx  # Complete test case management sheet
├── project.md              # Project architecture & Phase 1 requirements
├── skills.md               # Framework quality standards
└── README.md               # Setup and execution guide
```

---

## 🧪 Test Case Coverage (13 Test Cases / 22 Test Runs)

| Module | Test Case ID | Description |
|---|---|---|
| **Homepage** | `TC-HOME-01` | Homepage loads with core elements (title, search, location, sell button) |
| | `TC-HOME-02` | All 17 main categories are displayed on the homepage |
| | `TC-HOME-03` | Category navigation to major categories (Vehicles, Property, Phones, Electronics, Jobs) |
| | `TC-HOME-04` | Trending ads section loads with valid BDT price formatting |
| | `TC-HOME-05` | Language switcher presence and display |
| **Search** | `TC-SRCH-01` | Keyword search returns relevant listings (`iPhone`) |
| | `TC-SRCH-02` | Nonsense keyword search displays 0 results / empty state message |
| | `TC-SRCH-03` | Search results contain valid location metadata |
| **Filter** | `TC-FLT-01` | Condition filter ('Used') validation on Phones & Tablets |
| | `TC-FLT-02` | Price range filter bounds validation (`min: 10000`, `max: 20000` BDT) |
| | `TC-FLT-03` | Subcategory navigation & filter to `/mobile-phones` |
| **Navigation** | `TC-NAV-01` | Browser back button restores previous page state |
| **Footer** | `TC-FOOT-01` | Data-driven footer links return HTTP 200 and valid headings (6 links) |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (bundled with Node.js)

---

## 🚀 Setup & Installation

1. **Clone or open the repository directory:**
   ```bash
   cd Bikroy_Automation
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Chromium browser binary:**
   ```bash
   npx playwright install chromium
   ```

---

## ▶️ Test Execution Commands

### 1. Run the Full Test Suite
```bash
npx playwright test
```

### 2. Run with Single Attempt (No Retries)
```bash
npx playwright test --retries=0
```

### 3. Run in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```

### 4. Run in Interactive UI Mode
```bash
npx playwright test --ui
```

### 5. Run a Specific Module
```bash
# Search module only
npx playwright test tests/search.spec.js

# Homepage module only
npx playwright test tests/home.spec.js

# Filter module only
npx playwright test tests/filter.spec.js
```

### 6. Run a Specific Test Case by ID or Title
```bash
npx playwright test -g "TC-FLT-02"
```

---

## 📊 Viewing Test Reports & Traces

After test execution, launch the interactive HTML report:
```bash
npx playwright show-report
```
- In case of failures, traces, screenshots, and videos are automatically recorded in `test-results/` and linked directly in the HTML report.

---

## 🛡️ Safe Automation Guidelines

- **Read-Only:** All test cases interact only with public buyer-facing pages. No forms are submitted that publish listings, message sellers, or initiate OTP logins.
- **No Hardcoded Secrets:** Unauthenticated public flows require no credentials.
