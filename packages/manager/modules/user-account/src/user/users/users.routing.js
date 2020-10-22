import template from './users.html';
import controller from './users.controller';

angular.module('UserAccount').config(
  /* @ngInject */ ($stateProvider) => {
    const name = 'account.user.users';

    $stateProvider.state(name, {
      url: '/users',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: {
        format: 'json',
        value: ['.'],
      },
    });
  },
);
