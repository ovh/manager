angular.module('UserAccount').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.account.user.security.mfa', {
      url: '/mfa',
      templateUrl: 'account/user/security/2fa/user-security-2fa.html',
      controller: 'UserAccount.controllers.doubleAuth.2fa.enable',
      translations: { value: ['../..'], format: 'json' },
      layout: {
        name: 'modal',
        backdrop: 'static',
        keyboard: false,
      },
      toChilds: true,
    });
  },
);
