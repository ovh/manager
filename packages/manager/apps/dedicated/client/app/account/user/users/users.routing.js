import template from './users.html';
import controller from './users.controller';

angular
  .module('UserAccount')
  .config(
    /* @ngInject */ ($stateProvider) => {
      const name = 'app.account.user.users';

      $stateProvider.state(name, {
        url: '/users',
        template,
        controller,
        controllerAs: '$ctrl',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('user_users_title'),
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);
