angular.module('UserAccount').config(
  /* @ngInject */ ($stateProvider) => {
    const name = 'app.account.user.infos';

    $stateProvider.state(name, {
      url: '/infos',
      templateUrl: 'account/user/infos/user-infos.html',
      controller: 'UserAccount.controllers.Infos',
      translations: {
        format: 'json',
        value: ['../newAccountForm'],
      },
    });
  },
);
