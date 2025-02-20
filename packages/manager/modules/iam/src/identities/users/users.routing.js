import template from './users.html';
import controller from './users.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.identities.users', {
    url: '/users',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_users_title'),
    },
  });
};
