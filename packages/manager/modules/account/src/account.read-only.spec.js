import angular from 'angular';
import 'angular-mocks';
import { afterEach, describe, expect, it } from 'vitest';

import SignUpService from '../../sign-up/src/service';
import { accountReadOnlyInterceptor } from './account.constants';

// The same PUT /me saves the account details during sign-up and edits them in
// the account section. Sign-up must keep working for every kind of account
// while the account section rejects the request before it reaches the API.
const ACCOUNTS = {
  individual: {
    legalform: 'individual',
    firstname: 'Jane',
    name: 'Doe',
    address: '2 rue Kellermann',
    city: 'Roubaix',
    zip: '59100',
    country: 'FR',
  },
  corporation: {
    legalform: 'corporation',
    organisation: 'ACME',
    companyNationalIdentificationNumber: '42476141900045',
    vat: 'FR10424761419',
    firstname: 'Jane',
    name: 'Doe',
    country: 'FR',
  },
  association: {
    legalform: 'association',
    organisation: 'Les Amis du Code',
    companyNationalIdentificationNumber: '84298477700017',
    firstname: 'Jane',
    name: 'Doe',
    country: 'FR',
  },
};

// Sign-up app: the signUp service with no read-only interceptor, as the
// sign-up app does not load the account module.
angular.module('test.signUp', []).service('signUp', SignUpService);
// Account app: the interceptor registered by the account module.
angular
  .module('test.account', [])
  .config([
    '$httpProvider',
    ($httpProvider) =>
      $httpProvider.interceptors.push(accountReadOnlyInterceptor),
  ]);

// angular.mock.module/inject need Jasmine or Mocha: build the injector with
// ngMock directly, which swaps $httpBackend for the mock one.
const bootstrap = (moduleName) => {
  const $injector = angular.injector(['ng', 'ngMock', moduleName]);
  return {
    $injector,
    $http: $injector.get('$http'),
    $httpBackend: $injector.get('$httpBackend'),
    $rootScope: $injector.get('$rootScope'),
  };
};

describe('account read-only mode', () => {
  let app;

  afterEach(() => {
    app.$httpBackend.verifyNoOutstandingExpectation();
    app.$httpBackend.verifyNoOutstandingRequest();
  });

  describe.each(Object.entries(ACCOUNTS))('%s account', (legalform, model) => {
    it('can be created through sign-up', () => {
      app = bootstrap('test.signUp');
      const { $httpBackend, $injector } = app;
      $httpBackend.expectPUT('/me', model).respond(200, model);

      let status;
      $injector
        .get('signUp')
        .saveNic(model)
        .then((response) => {
          status = response.status;
        });
      $httpBackend.flush();

      expect(status).toBe(200);
    });

    it('cannot be edited from the account section', () => {
      app = bootstrap('test.account');
      const { $http, $rootScope } = app;
      // No PUT /me is declared on the mock backend: if the request reached it,
      // $httpBackend would throw "Unexpected request: PUT /me".
      let rejection;
      $http.put('/me', model).catch((error) => {
        rejection = error;
      });
      $rootScope.$digest();

      expect(
        rejection,
        `PUT /me was not rejected for ${legalform}`,
      ).toBeDefined();
      expect(rejection.status).toBe(403);
      expect(rejection.config.data).toEqual(model);
    });
  });

  it('still reads the account from the account section', () => {
    app = bootstrap('test.account');
    const { $http, $httpBackend } = app;
    $httpBackend.expectGET('/me').respond(200, ACCOUNTS.individual);
    $httpBackend
      .expectPOST('/newAccount/rules')
      .respond(200, [{ fieldName: 'legalform' }]);

    const results = [];
    $http.get('/me').then(({ status }) => results.push(status));
    $http
      .post('/newAccount/rules', { legalform: 'corporation' })
      .then(({ status }) => results.push(status));
    $httpBackend.flush();

    expect(results).toEqual([200, 200]);
  });
});
