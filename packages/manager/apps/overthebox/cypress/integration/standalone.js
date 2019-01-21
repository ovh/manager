import PageObject from '../support/po';

describe('OverTheBox', () => {
  const serviceId = 'overthebox.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

  beforeEach(() => {
    cy.fixture('2api_overthebox_devices').as('fixtures_2api_overthebox_devices');

    cy.server();

    // Mocks
    cy.route('GET', '/engine/apiv6/me', 'fixtures:apiv6_me');
    cy.route('GET', `/engine/apiv6/overTheBox/${serviceId}`, 'fixtures:apiv6_overthebox');
    cy.route('GET', `/engine/apiv6/overTheBox/${serviceId}/serviceInfos`, 'fixtures:apiv6_overthebox_serviceInfos');
    cy.route('POST', '/engine/apiv6/overTheBox/devices', 'fixtures:apiv6_overthebox_devices');
    cy.route('GET', `/engine/apiv6/overTheBox/${serviceId}/tasks`, 'fixtures:apiv6_overthebox_tasks');

    cy.route({
      method: 'GET',
      url: `/engine/apiv6/overTheBox/${serviceId}/device/availableActions`,
      status: 404,
      response: '',
    }).as('availableActions');

    cy.route({
      method: 'GET',
      url: `/engine/apiv6/overTheBox/${serviceId}/device`,
      status: 404,
      response: '',
    })
      .as('apiv6OvertheboxDevice');

    cy.route('GET', '/engine/apiv6/me/paymentMean/creditCard', 'fixtures:apiv6_me_paymentmean_creditcard')
      .as('apiv6MePaymentmeanCreditcard');

    cy.route('GET', '/engine/apiv6/overTheBox/devices', 'fixtures:apiv6_overthebox_devices')
      .as('apiv6OvertheboxDevices');

    cy.route('POST', '/engine/apiv6/overTheBox/devices', 'fixtures:apiv6_overthebox_devices')
      .as('post_apiv6OvertheboxDevices');

    cy.get('@fixtures_2api_overthebox_devices')
      .then((json) => {
        cy.route({
          method: 'GET',
          url: '/engine/2api/overTheBox/devices',
          status: 200,
          response: json,
          headers: {
            'content-type': 'application/json',
          },
        })
          .as('2apiOvertheboxDevices');
      });

    cy.route('GET', '/engine/apiv6/me/paymentMean/creditCard/123456', 'fixtures:apiv6_me_paymentmean_creditcard_detail')
      .as('apiv6MePaymentmeanCreditcardDetail');
  });

  it('should be a standalone module', async () => {
    cy.visit(`/#!/overTheBox/${serviceId}/details`);

    cy.wait('@availableActions');

    cy.fixture('overthebox').as('overTheBoxFixture');

    cy.get('@overTheBoxFixture').then((overthebox) => {
      cy
        .get('h1')
        .then(el => expect(el.text().trim()).to.equal(overthebox.customerDescription));
    });
  });

  it('should have details translations', () => {
    const details = new PageObject.DetailsPage(serviceId);
    details.visit();
    cy.wait('@availableActions');
    details.isVisible();
    cy.createTranslateSpy();


    cy.checkTranslations();
    cy.checkTranslateInstant();
  });

  it('should have order translations', () => {
    const order = new PageObject.OrderPage();
    order.visit();
    cy.wait([
      '@apiv6MePaymentmeanCreditcard',
      '@2apiOvertheboxDevices',
      '@post_apiv6OvertheboxDevices',
      // '@apiv6MePaymentmeanCreditcardDetail',
    ]);

    order.isVisible();
    cy.createTranslateSpy();

    cy.checkTranslations();
    cy.checkTranslateInstant();
  });
});
