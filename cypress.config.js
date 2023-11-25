const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')
const cypressSplit = require('cypress-split')

// const cypressEslint = require('cypress-eslint-preprocessor')
// const prettier = require('prettier')
require('dotenv').config()
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://gorest.co.in/public/v2/users/',
    setupNodeEvents(on, config) {
      // on('file:preprocessor', cypressEslint(prettier()))
      // on('file:preprocessor', prettier())
      allureWriter(on, config)
      cypressSplit(on, config)
      require('@cypress/grep/src/plugin')(config)
      return config
    },
    env: {
      airports_token: process.env.AIRPORTS_TOKEN,
      airports_url: process.env.AIRPORTS_URL,
      airport_code: process.env.OSAKA,
      airports_api_url: process.env.AIRPORTS_API_URL,
      airports_favorite_msg: process.env.FAVORITES_MESSAGE,
      airports_email: process.env.EMAIL,
      airports_password: process.env.PASSWORD,
      token: process.env.TOKEN,
      refresh_token: process.env.IMGUR_REFRESH,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      account_username: process.env.ACCOUNT_USERNAME
    },
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    waitForAnimation: true,
    defaultCommandTimeout: 10000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    failOnStatusCode: false,
    trashAssetsBeforeRuns: true,
    watchForFileChanges: false
  }
})
