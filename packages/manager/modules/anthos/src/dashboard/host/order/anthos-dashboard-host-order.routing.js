import { TRACKING_PREFIX } from '../../constants';
import { TRACKING_CHUNK } from './anthos-dashboard-host-order.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.order', {
    url: '/order',
    views: {
      'anthosTenantView@anthos.dashboard': 'anthosDashboardHostOrder',
    },
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${TRACKING_CHUNK}`,
    },
  });
};
