# Playwright TypeScript Framework

![Playwright Tests](https://github.com/pmqs98/playwright-demo/actions/workflows/playwright.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Playwright](https://img.shields.io/badge/playwright-latest-orange)

A test automation framework built with Playwright and TypeScript, covering UI testing, API testing, cross-browser execution, and CI/CD integration.

---

## Tech stack

| Tool                                 | Purpose                                 |
| ------------------------------------ | --------------------------------------- |
| [Playwright](https://playwright.dev) | Test runner, UI automation, API testing |
| TypeScript                           | Language                                |
| GitHub Actions                       | CI/CD pipeline                          |
| Docker                               | Containerised test execution            |
| Allure                               | Test reporting                          |
| Zod                                  | API response schema validation          |
| Faker.js                             | Dynamic test data generation            |

---

## Project structure

```
playwright-portfolio/
├── tests/
│   ├── ui/
│   │   ├── auth/           # Login, logout flows
│   │   ├── cart/           # Cart management
│   │   └── checkout/       # End-to-end checkout
│   ├── api/
│   │   ├── auth.spec.ts    # API auth token flows
│   │   └── bookings.spec.ts # CRUD operations
│   └── e2e/
│       └── purchase.spec.ts # Full purchase flow
├── pages/                  # Page Object Model classes
├── fixtures/               # Custom Playwright fixtures
├── utils/                  # Helpers and data factories
├── .github/workflows/      # CI/CD pipeline definitions
├── playwright.config.ts
└── package.json
```

---

## Applications under test

- **UI:** [Sauce Demo](https://www.saucedemo.com) — e-commerce test application
- **API:** [Restful Booker](https://restful-booker.herokuapp.com) — booking REST API

---

## Running the tests

### Prerequisites

```bash
node --version   # 20.x required
npm ci
npx playwright install
```

### Commands

```bash
# Run full suite
npx playwright test

# Run smoke tests only
npx playwright test --grep @smoke

# Run API tests only
npx playwright test --grep @api

# Run a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run a specific file
npx playwright test tests/ui/auth/login.spec.ts

# Run with browser visible
npx playwright test --headed

# Interactive UI mode (recommended for development)
npx playwright test --ui

# Open last HTML report
npx playwright show-report
```

### Run in Docker

```bash
# Build the image
docker build -t playwright-portfolio .

# Run the full suite
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report playwright-portfolio

# Run smoke tests only
docker run --rm -e GREP=@smoke -v $(pwd)/playwright-report:/app/playwright-report playwright-portfolio
```

---

## CI/CD

The GitHub Actions pipeline runs automatically on every push and pull request.

| Trigger        | What runs              |
| -------------- | ---------------------- |
| Pull request   | Smoke tests (`@smoke`) |
| Push to `main` | Full regression suite  |

Jobs run in parallel:

- **UI tests** — Chromium, Firefox, WebKit, Pixel 5, iPhone 13
- **API tests** — Restful Booker full CRUD suite

Test reports are uploaded as GitHub Actions artifacts on every run and retained for 30 days.

---

## Architecture decisions

See [DECISIONS.md](./DECISIONS.md) for a detailed explanation of the key design choices made in this framework, including why custom fixtures were preferred over `beforeEach`, how auth state reuse works, and the API-first test data strategy.

---

## Key patterns

**Page Object Model** — all UI interactions are encapsulated in typed page classes under `/pages`. Tests never call `page.locator()` directly.

**Custom fixtures** — the base `test` object is extended in `/fixtures/index.ts` to inject page objects and an API helper automatically. Tests declare what they need and Playwright handles the rest.

**Auth state reuse** — a setup project runs once before the suite, saves the logged-in session to `.auth/user.json`, and all tests start already authenticated. No UI login per test.

**API-first test data** — test data is created and cleaned up via API calls, never through the UI. This makes tests faster and independent of UI state.

**Schema validation** — all API responses are validated against Zod schemas, catching contract-breaking changes automatically regardless of HTTP status.

---

## Test coverage

| Area           | Tests                                        | Tags                 |
| -------------- | -------------------------------------------- | -------------------- |
| Authentication | Login flows, logout, locked accounts         | `@smoke`             |
| Cart           | Add, remove, badge count                     | `@regression`        |
| Checkout       | End-to-end with mocked payment               | `@regression`        |
| API — Auth     | Token generation, invalid credentials        | `@api` `@smoke`      |
| API — Bookings | Full CRUD, schema validation, negative cases | `@api` `@regression` |
| Cross-browser  | Chromium, Firefox, WebKit                    | `@regression`        |
| Mobile         | Pixel 5, iPhone 13                           | `@regression`        |

---

## Environment variables

Create a `.env` file at the root for local overrides (never commit this file):

```
BASE_URL=https://www.saucedemo.com
API_BASE_URL=https://restful-booker.herokuapp.com
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce
```

In CI these are stored as GitHub Actions secrets.
