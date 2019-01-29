describe('Pack should be standalone', () => {
  beforeEach(() => {
    cy.server();
    cy.route(
      'GET',
      '/engine/apiv6/me',
      'fixtures:me',
    ).as('apiMe');
  });
});
