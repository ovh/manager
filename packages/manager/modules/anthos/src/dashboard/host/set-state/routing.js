import { TRACKING_PREFIX } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.set-state', {
    url: '/set-state',
    params: {
      host: null,
    },
    views: {
      modal: {
        component: 'anthosHostSetState',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      goBack: /* @ngInject */ (goToHost) => (message, type) =>
        goToHost(message, type),

      host: /* @ngInject */ ($transition$) => $transition$.params().host,

      setStateHitTracking: () => {
        return 'define-state-host';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::define-state-host`,
    },
  });
};
