import { SSO_TRACKING_HITS } from './sso.constants';

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
        $translate.instant('iam_identities_sso'),
      goToSSODetails: /* @ngInject */ ($state) => () =>
        $state.go(ssoDetailState),
    },
    atInternet: {
      rename: SSO_TRACKING_HITS.LISTING_PAGE,
    },
  });

  $stateProvider.state(ssoDetailState, {
    url: '/details',
    template: ssoDetailsTemplate,
    controller: ssoDetailsController,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sso_detail_title'),
      goToSSOList: /* @ngInject */ ($state) => () => $state.go(ssoListState),
    },
    atInternet: {
      rename: SSO_TRACKING_HITS.DETAIL_PAGE,
    },
  });
};
