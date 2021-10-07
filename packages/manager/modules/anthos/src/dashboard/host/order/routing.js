import { TRACKING_PREFIX } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.order', {
    url: '/order',
    views: {
      modal: {
        component: 'anthosOrderHost',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      goBack: /* @ngInject */ (goToHost) => () => goToHost(),

      orderHostHitTracking: () => {
        return 'order-host';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::order-host`,
    },
  });
};
