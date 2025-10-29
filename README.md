# Playwright Web Automation Testing

A practice project for UI test automation using Playwright based on a modified ngx-admin application.

## Technologies

- **Playwright** - E2E testing framework
- **TypeScript** - test development language
- **Allure** - test reporting
- **Angular** v14 - application under test

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

## Running Tests

```bash
# Run all tests
npm test

# Run with UI mode
npm run test:ui

# Run in headed mode (visible browser)
npm run test:headed

# Run with debug mode
npm run test:debug

# Run on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile
```

## Parallel Execution

```bash
# Parallel run (4 workers)
npm run test:parallel

# Serial run
npm run test:serial
```

## Reports

```bash
# View HTML report
npm run report

# Generate and view Allure report
npm run report:allure
```

## Project Structure

```
tests/
├── 1interactionWithWebElements.spec.ts  # Element interactions
├── 2autoWaitingTimeouts.spec.ts         # Auto-waiting and timeouts
├── 3UIComponents.spec.ts                # UI components testing
├── 4dragAndDropWithiFrame.spec.ts       # Drag-and-drop and iFrame
├── 5usePOM.spec.ts                      # Page Object Model
├── apiTests.spec.ts                     # API testing
└── apiMockModify.spec.ts                # API mocking and modification
```

## CI/CD

The project is configured to run in GitHub Actions with automated testing on Ubuntu.

## Useful Commands

```bash
# Generate tests with CodeGen
npm run codegen

# Clean test artifacts
npm run clean

# Run application locally
npm start
```

## Configuration

- Base URL: `http://localhost:4200`
- Browsers: Chromium, Firefox, WebKit, Mobile (iPhone 14 Pro)
- Retry on CI: 2 attempts
- Screenshots and videos saved on test failures
