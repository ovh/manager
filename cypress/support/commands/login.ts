/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      /** Login to OVH */
      login(): Cypress.Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.visit(Cypress.env('appUrl'));
  cy.origin(Cypress.env('accountLoginOrigin'), () => {
    cy.get('input#account').type(Cypress.env('accountLogin'));
    cy.get('button#login-submit').click();
  });
  cy.origin(Cypress.env('ovhLoginOrigin'), () => {
    cy.get('input[type="email"]').type(Cypress.env('email'));
    cy.get('input[type="password"]').type(Cypress.env('password'));
    cy.get('#submitButton').click();
  });
});

// Need this export to be allowed to declare global because we have no import yet
export {};
