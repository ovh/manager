describe('OverTheBox', () => {
  it('should be a standalone module', async () => {
    cy.server();

    // Mocks
    cy.route('GET', '/engine/apiv6/me', 'fixtures:me');
    cy.route('GET', '/engine/apiv6/overTheBox/overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'fixtures:overthebox');
    cy.route('GET', '/engine/apiv6/overTheBox/overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/serviceInfos', 'fixtures:serviceInfos');
    cy.route('POST', '/engine/apiv6/overTheBox/devices', 'fixtures:devices');
    cy.route('GET', '/engine/apiv6/overTheBox/overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/tasks', 'fixtures:tasks');

    cy.route({
      method: 'GET',
      url: '/engine/apiv6/overTheBox/overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/device/availableActions',
      status: 404,
      response: '',
    }).as('availableActions');

    cy.route({
      method: 'GET',
      url: '/engine/apiv6/overTheBox/overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/device',
      status: 404,
      response: '',
    });

    cy.visit('/#!/overTheBox/overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/details');

    cy.wait('@availableActions');

    cy.fixture('overthebox').as('overTheBoxFixture');

    cy.get('@overTheBoxFixture').then((overthebox) => {
      cy
        .get('h1')
        .then(el => expect(el.text().trim()).to.equal(overthebox.customerDescription));
    });
  });
});
