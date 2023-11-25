require('cypress-plugin-api')
const chaiJsonSchema = require('chai-json-schema')
chai.use(chaiJsonSchema)
const schema = require('../fixtures/reqres_schema.json')
describe(
  'Test REST API scenarios using api plugin (api plugin)',
  {
    env: {
      hideCredentials: true,
      hideCredentialsOptions: {
        headers: ['authorization']
      }
    }
  },
  () => {
    it('Perform get requests', () => {
      cy.api('https://reqres.in/api/users').then(response => {
        expect(response.status).to.eq(200)
        expect(response.headers).to.have.property(
          'content-type',
          'application/json; charset=utf-8'
        )
        expect(response.body).to.have.all.keys(
          'page',
          'per_page',
          'total',
          'total_pages',
          'data',
          'support'
        )
        expect(response.body.data).to.be.an('array').and.have.lengthOf(6)
        expect(response.body).to.be.jsonSchema(schema)
      })
    })
    it(`POST request to create user`, () => {
      cy.api({
        method: 'POST',
        url: 'https://reqres.in/api/users',
        body: {
          name: 'morpheus',
          job: 'leader'
        }
      }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.body)
          .to.be.an('object')
          .and.have.all.keys('name', 'job', 'id', 'createdAt')
      })
    })

    it.only(`Should upload file programatically`, () => {
      cy.fixture('cypress.png', 'binary').then(filecontent => {
        const formData = new FormData()
        const fileName = 'cypress.png'
        const blob = Cypress.Blob.binaryStringToBlob(filecontent, 'image/png')
        formData.append('file', blob, fileName)
        cy.request({
          method: 'POST',
          url: 'https://jquery-file-upload.appspot.com/',
          headers: {
            'Content-Type': `image/png`
          }
        }).then(response => {
          cy.log(response.status)
          cy.log(response.body)
          // let jsonResponse = JSON.parse(
          //   String.fromCharCode.apply(null, new Uint8Array(response.body))
          // )
          // cy.log(jsonResponse)
        })
      })
    })
  }
)
