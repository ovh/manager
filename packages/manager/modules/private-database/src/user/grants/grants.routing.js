import template from './private-database-user-grants.html';
import controller from './private-database-user-grants.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.user.dashboard.grants', {
    url: '/grants',
    template,
    controller,
    controllerAs: 'usersGrantsCtrls',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_user_grants'),
    },
  });
};
