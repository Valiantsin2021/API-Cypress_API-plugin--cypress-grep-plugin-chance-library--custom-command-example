const Chance = require('chance')

const chance = new Chance()
const bearer = Cypress.env('token')

let name = chance.name()
let email = chance.email()
let gender = chance.gender()
let patchedName = chance.name()
let patchedEmail = chance.email()
let patchedGender = chance.gender()
let id
let patchedId
function randomStatus() {
  const random = chance.coin()
  if (random === 'heads') {
    return 'active'
  } else {
    return 'inactive'
  }
}
describe('Test REST API scenariosG (native test)', () => {
  it('Perform GET request of all users', () => {
    cy.print(gender)
    cy.request('/').then(response => {
      expect(response.status).to.eq(200)
      expect(response.headers).to.have.property(
        'content-type',
        'application/json; charset=utf-8'
      )
      expect(response.body).to.be.an('array').and.have.lengthOf(10)
      response.body.forEach(object => {
        expect(object).to.have.all.keys(
          'id',
          'name',
          'email',
          'gender',
          'status'
        )
      })
    })
  })
  it('Should add new user with POST request and enshure the user created', () => {
    cy.request({
      method: 'POST',
      url: '/',
      auth: {
        bearer
      },
      body: {
        name,
        email,
        gender,
        status: randomStatus()
      }
    }).then(response => {
      expect(response.status).to.equal(201)
      expect(response.statusText).to.equal('Created')
      expect(response.body).to.have.all.keys(
        'id',
        'name',
        'email',
        'gender',
        'status'
      )
      expect(Object.values(response.body)).to.include(
        name,
        email,
        gender,
        randomStatus()
      )
      id = response.body.id
    })
  })
  it(`GET created user`, () => {
    cy.request({
      method: 'GET',
      url: '/',
      qs: { name }
    }).as('newUser')
    cy.get('@newUser').then(response => {
      expect(response.status).to.be.equal(200)
      cy.log(response.body.id)
      Cypress.env('userId', response.body.id)
    })
  })
  it(`Should PATCH created user and ensure the changes made`, () => {
    cy.request({
      method: 'PATCH',
      url: `/${Cypress.env('userId')}`,
      auth: {
        bearer
      },
      body: {
        patchedName,
        patchedEmail,
        patchedGender,
        status: randomStatus()
      }
    }).then(response => {
      expect(response.status).to.equal(200)
      expect(Object.values(response.body)).to.include(
        patchedName,
        patchedEmail,
        patchedGender
      )
      patchedId = response.body.id
      cy.request({
        method: 'GET',
        url: `/`,
        qs: { name: patchedName }
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(Object.values(response.body)).to.include(
          patchedName,
          patchedEmail,
          patchedGender
        )
      })
    })
  })
  it(`Should DELETE patched user`, () => {
    cy.wrap(patchedId)
      .then(patchedId => {
        cy.request({
          method: 'DELETE',
          url: `/${patchedId.toString()}`
        })
      })
      .then(response => {
        expect(response.status).to.equal(204)
      })
  })
  it(`Should try to GET deleted user`, () => {
    cy.wrap(patchedId).then(patchedId => {
      cy.request({
        method: 'GET',
        url: `/${patchedId.toString()}`
      }).then(response => {
        expect(response.status).to.equal(404)
      })
    })
  })
})
