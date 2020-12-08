import controller from './user-contacts.controller';

angular
  .module('ovhManagerDedicatedAccount')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.contacts';

    $stateProvider.state(name, {
      url: '/contacts',
      templateUrl: 'account/contacts/user-contacts.html',
      controller,
      controllerAs: 'contactCtrl',
      abstract: true,
      translations: {
        format: 'json',
        value: ['../user'],
      },
    });

    $urlRouterProvider.when(/^\/useraccount\/contacts/, ($location, $state) =>
      $state.go(`${name}.services`, $location.search()),
    );
  });
