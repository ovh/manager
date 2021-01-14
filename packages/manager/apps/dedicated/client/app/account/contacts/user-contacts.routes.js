angular
  .module('UserAccount')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.contacts';

    $stateProvider.state(name, {
      url: '/contacts',
      templateUrl: 'account/contacts/user-contacts.html',
      controller: 'UserAccount.controllers.contactCtrl',
      controllerAs: 'contactCtrl',
      redirectTo: 'app.account.contacts.services',
      translations: {
        format: 'json',
        value: ['../user'],
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_account_contacts'),
      },
    });

    $urlRouterProvider.when(/^\/useraccount\/contacts/, ($location, $state) =>
      $state.go(`${name}.services`, $location.search()),
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
