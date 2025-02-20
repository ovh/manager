import ssoDetailsTemplate from './details/sso-details.html';
import ssoDetailsController from './details/sso-details.controller';

export default /* @ngInject */ ($stateProvider) => {
  const ssoListState = 'iam.identities.sso';
  const ssoDetailState = 'iam.identities.sso.ssoDetails';

  $stateProvider.state(ssoListState, {
    url: '/sso',
    component: 'iamSso',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_identities_sso_breadcrumb'),
      goToSSODetails: /* @ngInject */ ($state) => () =>
        $state.go(ssoDetailState),
    },
  });

  $stateProvider.state(ssoDetailState, {
    url: '/details',
    template: ssoDetailsTemplate,
    controller: ssoDetailsController,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sso_title'),
      goToSSOList: /* @ngInject */ ($state) => () => $state.go(ssoListState),
    },
  });
};
