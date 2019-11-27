angular
  .module('UserAccount')
  .config(/* @ngInject */($stateProvider) => {
    const name = 'app.account.user.advanced';
    $stateProvider.state(name, {
      url: '/advanced',
      templateUrl: 'account/user/advanced/user-advanced.html',
      controller: 'UserAccount.controllers.advanced',
      controllerAs: 'advancedCtrl',
      translations: ['../'],
    });
  });
