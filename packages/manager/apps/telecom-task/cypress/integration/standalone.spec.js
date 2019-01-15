import Page from '../support/po';

const { SummaryPage } = Page.TelecomTaskPage;

describe('Telecom Task should be standalone', () => {
  beforeEach(() => {
    cy.fixture('2api_pack_xdsl_tasks_details_all').as('fixture_2api_pack_xdsl_tasks_details_all');

    cy.server();
    cy.route(
      'GET',
      '/engine/apiv6/me',
      'fixtures:me',
    ).as('apiMe');

    cy.get('@fixture_2api_pack_xdsl_tasks_details_all')
      .then((json) => {
        cy.route({
          method: 'GET',
          url: '/engine/2api/pack/xdsl/tasks/detail/all?page=1&perPage=5&sort=pack+DESC&status=todo+doing+cancelled+error+problem',
          status: 200,
          response: json,
          headers: {
            'content-type': 'application/json',
          },
        })
          .as('2apiPackXdslTasksDetailsAll');
      });
  });

  it('should load summary', () => {
    const summary = new SummaryPage();
    summary.visit();
    summary.checkUrl();
    summary.isVisible();
    cy.createTranslateSpy();

    cy.wait([
      '@apiMe',
      '@2apiPackXdslTasksDetailsAll',
    ]);

    cy.checkTranslations();
    cy.checkTranslateInstant();

    cy.title().should('not.eq', 'Telecom Task App');
  });
});
