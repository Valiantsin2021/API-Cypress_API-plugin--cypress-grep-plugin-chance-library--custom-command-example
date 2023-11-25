require('cypress-plugin-api')
const chaiJsonSchema = require('chai-json-schema')
const authSchema = require('../fixtures/imgur_schema.json')
chai.use(chaiJsonSchema)
const refresh_token = Cypress.env('refresh_token')
const client_id = Cypress.env('client_id')
const account_username = Cypress.env('account_username')
describe(
  `Test Imgur API auth, (IMGUR)`,
  {
    env: {
      hideCredentials: true,
      hideCredentialsOptions: {
        auth: ['bearer'],
        body: ['refresh_token', 'client_secret', 'client_id']
      }
    }
  },
  () => {
    it('get auth token', () => {
      cy.api({
        method: 'POST',
        url: 'https://api.imgur.com/oauth2/token',
        body: {
          refresh_token,
          client_id,
          client_secret: Cypress.env('client_secret'),
          grant_type: 'refresh_token'
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.jsonSchema(authSchema)
        expect(response.body.account_username).to.eq(account_username)
        Cypress.env('access_token', response.body.access_token)
      })
    })
    it('get Imgur account status ', () => {
      cy.api({
        method: 'GET',
        url: `https://api.imgur.com/account/v1/${account_username}`,
        headers: {
          Authorization: `Client-ID ${client_id}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.reputation_name).to.eq('Neutral')
      })
    })
    it('get Imgur account feed', () => {
      cy.api({
        method: 'GET',
        url: 'https://api.imgur.com/3/feed',
        auth: {
          bearer: Cypress.env('access_token')
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.status).to.eq(200)
      })
    })
  }
)
