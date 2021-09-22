import { TRACKING_PREFIX } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.order-public-ip', {
    url: '/order-public-ip',
    views: {
      modal: {
        component: 'orderPublicIp',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      orderPublicIpHitTracking: () => {
        return 'order-public-ip';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::order-public-ip`,
    },
  });
};
