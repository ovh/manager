export default class BasePage {
  constructor() {
    this.mainSection = 'body';
    this.hashUrl = '#!/';
  }

  // eslint-disable-next-line class-methods-use-this
  getE2E(name) {
    return cy.get(`[data-e2e-id="${name}"]`);
  }

  getMainSection() {
    return this.getE2E(this.mainSection);
  }

  isVisible() {
    return this.getMainSection().should('be.visible');
  }

  getHashUrl() {
    return this.hashUrl;
  }

  checkUrl() {
    cy.hash().should('include', this.getHashUrl());
  }

  // eslint-disable-next-line class-methods-use-this
  visit() {
    return cy.visit(this.getHashUrl());
  }
}
