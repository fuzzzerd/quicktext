/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('cypress');

// https://github.com/cypress-io/cypress/issues/28802

module.exports = defineConfig({
  defaultCommandTimeout: 16000,
  retries: {
    runMode: 3,
    openMode: 0
  },
  e2e: {
    baseUrl: 'https://localhost:5173'
  },
  chromeWebSecurity: false,
  video: false
});
