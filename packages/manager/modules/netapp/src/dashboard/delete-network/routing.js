import { TRACKING_BASE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.index.delete-network', {
    url: '/delete-network',
    views: {
      modal: {
        component: 'ovhManagerNetAppNetworkDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `${TRACKING_BASE}::${tracker}`,
        }),
      trackPage: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackPage({
          name: `${TRACKING_BASE}-${tracker}`,
        }),
      goBack: /* @ngInject */ ($state) => (params) =>
        $state.go('^', params, { reload: params.isDissociating }),
    },
    atInternet: {
      rename: TRACKING_BASE,
    },
  });
};
