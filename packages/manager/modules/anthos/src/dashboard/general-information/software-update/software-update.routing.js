import { TRACKING_PREFIX } from '../../constants';
import { TRACKING_CHUNK } from './software-update.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.software-update', {
    url: '/software-update',
    views: {
      'anthosTenantView@anthos.dashboard': 'anthosDashboardSoftwareUpdate',
    },
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${TRACKING_CHUNK}`,
    },
  });
};
