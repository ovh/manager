import { TRACKING_PREFIX } from '../constants';
import { TRACKING_CHUNK } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.access-restriction', {
    url: '/access-restriction',
    views: {
      anthosTenantView: 'anthosAccessRestriction',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_access_restriction_title'),
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${TRACKING_CHUNK}`,
    },
  });
};
