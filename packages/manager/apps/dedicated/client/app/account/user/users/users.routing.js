import template from './users.html';
import controller from './users.controller';
import ssoDetailsTemplate from './sso/details/user-users-sso-details.html';
import ssoDetailsController from './sso/details/user-users-sso-details.controller';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.users';
  const nameSSODetails = 'app.account.user.users.ssoDetails';

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

  $stateProvider.state(nameSSODetails, {
    url: '/sso',
    template: ssoDetailsTemplate,
    controller: ssoDetailsController,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_users_title'),
    },
  });
};
