angular
  .module('UserAccount')
  .config(
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
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('user_infos'),
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
