import controller from './user-contacts-update.controller';

angular
  .module('ovhManagerDedicatedAccount')
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.account.contact-update-domain', {
      url: '/contact/:currentDomain/:contactId?fields',
      templateUrl: 'account/contacts/update/user-contacts-update.html',
      controller,
      controllerAs: 'contactCtrl',
      translations: {
        format: 'json',
        value: ['../../user'],
      },
    });

    // TODO: Need refactoring this two steps ... Quickfix to manage legacy url correctly

    $stateProvider.state('app.account.contact-update', {
      url: '/contact/:contactId/?fields',
      templateUrl: 'account/contacts/update/user-contacts-update.html',
      controller,
      controllerAs: 'contactCtrl',
      translations: {
        format: 'json',
        value: ['../../user'],
      },
    });

    $stateProvider.state('app.account.contact-update2', {
      url: '/contact/:contactId?fields',
      templateUrl: 'account/contacts/update/user-contacts-update.html',
      controller,
      controllerAs: 'contactCtrl',
      translations: {
        format: 'json',
        value: ['../../user'],
      },
    });

    $urlRouterProvider.when(/^\/useraccount\/contact\//, ($location) =>
      $location.url($location.url().replace('/useraccount', '')),
    );
  });
