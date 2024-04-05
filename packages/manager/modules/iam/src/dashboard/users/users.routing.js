import template from './users.html';
import controller from './users.controller';
import ssoDetailsTemplate from './sso/details/sso-details.html';
import ssoDetailsController from './sso/details/sso-details.controller';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'iam.dashboard.users';
  const nameSsoDetails = 'iam.dashboard.users.ssoDetails';

  $stateProvider.state(name, {
    url: '/users',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_users_title'),
      goToSSO: /* @ngInject */ ($state) => () => $state.go(nameSsoDetails),
    },
  });

  $stateProvider.state(nameSsoDetails, {
    url: '/sso',
    template: ssoDetailsTemplate,
    controller: ssoDetailsController,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_users_sso_title'),
    },
  });
};
