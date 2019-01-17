// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// Translations Commands
// $translate.instant : call cy.createTranslateSpy() and call cy.checkTranslateInstant();
// $translate directives : cy.checkTranslations();
Cypress.Commands.add('createTranslateSpy', () => {
  cy.getAngularInjector('$translate')
    .then($translate => cy.spy($translate, 'instant').as('$translateInstantSpy'));
});

Cypress.Commands.add('checkTranslateInstant', () => {
  const checkTranslateInstant = (translationsKeys) => {
    cy.get('@$translateInstantSpy')
      .then(($translateInstantSpy) => {
        cy.log(`$translate.instant called ${$translateInstantSpy.callCount} times`);

        for (let callIndex = 0; callIndex < $translateInstantSpy.callCount; callIndex += 1) {
          const call = $translateInstantSpy.getCall(callIndex);
          expect(translationsKeys).to.include(call.args[0]);
        }
      });
  };

  cy.getAngularInjector('$translate')
    .then(($translate) => {
      const translations = $translate.getTranslationTable();
      const translationsKeys = Object.keys(translations);

      checkTranslateInstant(translationsKeys);
    });
});

Cypress.Commands.add('checkTranslations', () => {
  const escapeRegex = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const expectMatchTranslation = (content, translation) => {
    const translationRegex = new RegExp(escapeRegex(translation).replace(/\\{\\{(.*)\\}\\}/g, '.*'), 'g');
    expect(content).to.match(translationRegex);
  };

  const checkTranslateDirective = (translations) => {
    cy.get('[data-translate]').each((element) => {
      const elementTranslation = element.data('translate');
      expect(translations).to.have.property(elementTranslation);

      const translation = translations[element.data('translate')];
      expectMatchTranslation(element.html(), translation);
    });
  };

  const checkTranslateAttrDirective = (translations) => {
    cy.getAngular()
      .then((angular) => {
        cy.getAngularInjector('$parse')
          .then(($parse) => {
            const dataTranslateAttrsElements = Cypress.$('[data-translate-attr]');
            if (dataTranslateAttrsElements.length) {
              dataTranslateAttrsElements.each((index, element) => {
                const $element = Cypress.$(element);
                const translateAttr = $element.data('translateAttr');

                const translateAttributes = $parse(translateAttr)();

                angular.forEach(translateAttributes, (translationId, attribute) => {
                  expect(translations).to.have.property(translationId);

                  const translation = translations[translationId];
                  expectMatchTranslation(element.getAttribute(attribute), translation);
                });
              });
            }
          });
      });
  };

  cy.getAngularInjector('$translate')
    .then(($translate) => {
      const translations = $translate.getTranslationTable();

      checkTranslateDirective(translations);
      checkTranslateAttrDirective(translations);
    });
});


// AngularJS commands
// get AngularJS instance
Cypress.Commands.add('getAngular', () => cy.window().its('angular'));

// get AngularJS scope for element
Cypress.Commands.add('getAngularScope', element => cy.getAngular().then(ng => ng.element(element).scope()));

// get service from AngularJS injector
Cypress.Commands.add('getAngularInjector', injected => cy.getAngular()
  .then((angular) => {
    cy.document()
      .then(document => angular.element(document.body).injector().get(injected));
  }));
