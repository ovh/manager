angular
  .module('UserAccount')
  .config(
    /* @ngInject */ ($stateProvider) => {
      const name = 'app.account.user.security';

      $stateProvider.state(name, {
        url: '/security',
        templateUrl: 'account/user/security/user-security.html',
        controller: 'UserAccount.controllers.doubleAuth',
        translations: ['../'],
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('user_security'),
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
