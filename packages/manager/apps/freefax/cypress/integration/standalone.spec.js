import Page from '../support/po';

const { DashboardPage, NotificationsPage, VoicemailConfigurationPage } = Page.FreefaxPage;

describe('FreeFax should be a standalone', () => {
  const serviceId = '0033123456789';

  beforeEach(() => {
    cy.fixture('2api_freefax_details').as('fixture_2api_freefax_details');

    cy.server();
    cy.route(
      'GET',
      '/engine/apiv6/me',
      'fixtures:me',
    ).as('apiMe');

    cy.get('@fixture_2api_freefax_details')
      .then((json) => {
        cy.route({
          method: 'GET',
          url: `/engine/2api/freefax/${serviceId}/details`,
          status: 200,
          response: json,
          headers: {
            'content-type': 'application/json',
          },
        })
          .as('2apiFreefaxDetails');
      });

    cy.route(
      'GET',
      '/engine/apiv6/freefax.json',
      'fixtures:apiv6_freefax',
    );

    cy.route(
      'GET',
      `/engine/2api/freefax/notifications/${serviceId}`,
      'fixtures:2api_freefax_notifications',
    );

    cy.route({
      method: 'GET',
      url: `/engine/apiv6/freefax/${serviceId}/voicemail/routing`,
      status: 200,
      response: '"fax"',
    })
      .as('apiv6FreefaxVoicemailRouting');

    cy.route('GET', `/engine/apiv6/freefax/${serviceId}/voicemail`, 'fixture:apiv6_freefax_voicemail')
      .as('apiv6FreefaxVoicemail');
  });

  it('should navigate between states', () => {
    cy.window().its('console').then((csl) => {
      cy.spy(csl, 'error');
    });

    const dashboard = new DashboardPage(serviceId);
    dashboard.visit();
    dashboard.isVisible();
    cy.createTranslateSpy();

    cy.wait([
      '@apiMe',
      '@2apiFreefaxDetails',
      '@apiv6FreefaxVoicemailRouting',
    ]);

    cy.checkTranslations();

    const notifications = dashboard.navigateToNotifications();
    notifications.checkUrl();
    notifications.isVisible();
    cy.checkTranslations();
    notifications.goBack();

    dashboard.checkUrl();
    dashboard.isVisible();

    const voicemailConfiguration = dashboard.navigateToVoiceMailConfiguration();
    voicemailConfiguration.checkUrl();
    voicemailConfiguration.isVisible();
    cy.wait('@apiv6FreefaxVoicemail');
    cy.checkTranslations();

    voicemailConfiguration.goBack();
    dashboard.checkUrl();
    dashboard.isVisible();

    cy.checkTranslateInstant();
  });

  it('should have dashboard translations', () => {
    const dashboard = new DashboardPage(serviceId);
    dashboard.visit();
    dashboard.isVisible();
    cy.createTranslateSpy();

    cy.wait([
      '@apiMe',
      '@2apiFreefaxDetails',
      '@apiv6FreefaxVoicemailRouting',
    ]);

    cy.checkTranslations();
    cy.checkTranslateInstant();
  });

  it('should have notifications translations', () => {
    const notifications = new NotificationsPage(serviceId);
    notifications.visit();
    notifications.isVisible();
    cy.createTranslateSpy();

    cy.wait([
      '@apiMe',
      '@2apiFreefaxDetails',
      '@apiv6FreefaxVoicemailRouting',
    ]);

    cy.checkTranslations();
    cy.checkTranslateInstant();
  });

  it('should have voicemailConfiguration translations', () => {
    const voicemailConfiguration = new VoicemailConfigurationPage(serviceId);
    voicemailConfiguration.visit();
    voicemailConfiguration.isVisible();
    cy.createTranslateSpy();

    cy.wait([
      '@apiMe',
      '@2apiFreefaxDetails',
      '@apiv6FreefaxVoicemailRouting',
      '@apiv6FreefaxVoicemail',
    ]);

    cy.checkTranslations();
    cy.checkTranslateInstant();
  });
});
