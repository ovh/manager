angular
  .module('UserAccount')
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.account.contact-update-domain', {
      url: '/contact/:currentDomain/:contactId?fields',
      templateUrl: 'account/contacts/update/user-contacts-update.html',
      controller: 'UserAccount.controllers.update',
      controllerAs: 'contactCtrl',
      translations: {
        format: 'json',
        value: ['../../user'],
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_account_contacts_update'),
      },
    });

    // TODO: Need refactoring this two steps ... Quickfix to manage legacy url correctly

    $stateProvider.state('app.account.contact-update', {
      url: '/contact/:contactId/?fields',
      templateUrl: 'account/contacts/update/user-contacts-update.html',
      controller: 'UserAccount.controllers.update',
      controllerAs: 'contactCtrl',
      translations: {
        format: 'json',
        value: ['../../user'],
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_account_contacts_update'),
      },
    });

    $stateProvider.state('app.account.contact-update2', {
      url: '/contact/:contactId?fields',
      templateUrl: 'account/contacts/update/user-contacts-update.html',
      controller: 'UserAccount.controllers.update',
      controllerAs: 'contactCtrl',
      translations: {
        format: 'json',
        value: ['../../user'],
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_account_contacts_update'),
      },
    });

    $urlRouterProvider.when(/^\/useraccount\/contact\//, ($location) =>
      $location.url($location.url().replace('/useraccount', '')),
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
