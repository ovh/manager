import { TRACKING_PREFIX } from '../../constants';
import { TRACKING_CHUNK } from './order-public-ip.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips.order-public-ip', {
    url: '/order-public-ip',
    views: {
      modal: {
        component: 'orderPublicIp',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${TRACKING_CHUNK}`,
    },
  });
};
