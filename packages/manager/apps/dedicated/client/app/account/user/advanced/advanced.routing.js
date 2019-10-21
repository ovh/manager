import includes from 'lodash/includes';

angular
  .module('UserAccount')
  .config(/* @ngInject */($stateProvider, coreConfigProvider) => {
    const name = 'app.account.user.advanced';

    if (includes(['EU', 'CA'], coreConfigProvider.getRegion())) {
      $stateProvider.state(name, {
        url: '/advanced',
        templateUrl: 'account/user/advanced/user-advanced.html',
        controller: 'UserAccount.controllers.advanced',
        controllerAs: 'advancedCtrl',
        translations: ['../'],
      });
    }
  });
