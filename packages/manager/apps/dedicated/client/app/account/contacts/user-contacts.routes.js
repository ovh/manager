angular.module('UserAccount').config(($stateProvider, $urlRouterProvider) => {
  const name = 'app.account.contacts';

  $stateProvider.state(name, {
    url: '/contacts',
    templateUrl: 'account/contacts/user-contacts.html',
    controller: 'UserAccount.controllers.contactCtrl',
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
