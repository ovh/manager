import { TRACKING_BASE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.network', {
    url: '/network',
    views: {
      'netappContainer@netapp': 'ovhManagerNetAppNetworkConfiguration',
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('isNetworkAvailable')
        .then((isNetworkAvailable) =>
          isNetworkAvailable ? null : 'netapp.dashboard',
        );
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_network_configuration_title'),
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          type: 'action',
          name: `${TRACKING_BASE}::${tracker}`,
        }),
      trackSuccess: /* @ngInject */ (atInternet) => () =>
        atInternet.trackPage({
          name: `${TRACKING_BASE}-success`,
        }),
      trackError: /* @ngInject */ (atInternet) => () =>
        atInternet.trackPage({
          name: `${TRACKING_BASE}-error`,
        }),
      goBack: /* @ngInject */ ($state, trackClick) => (trackingAction) => {
        trackClick(trackingAction);
        return $state.go('^');
      },
      vracks: /* @ngInject */ (NetAppDashboardService) =>
        NetAppDashboardService.getVracks().then(({ data }) =>
          data.map((vrack) => ({
            ...vrack,
            internalName: vrack.iam.urn.split(':').pop(),
          })),
        ),
      vrackServices: /* @ngInject */ (NetAppDashboardService) =>
        NetAppDashboardService.getVrackServices().then(({ data }) =>
          data.map((vs) => {
            const name = vs.currentState.displayName || vs.id;
            return {
              ...vs,
              display: {
                name,
                nameWithVrackId: vs.currentState.vrackId
                  ? `${name} (${vs.currentState.vrackId})`
                  : name,
              },
            };
          }),
        ),
      createVrackServiceLink: /* @ngInject */ () => 'TODO',
      createSubnetLink: /* @ngInject */ () => 'TODO',
      goToVrackOrder: /* @ngInject */ (
        $window,
        coreConfig,
        NetappNetworkConfigurationService,
        trackClick,
      ) => (event) => {
        event.preventDefault();
        trackClick('add-vrack');
        $window.open(
          NetappNetworkConfigurationService.getVrackOrderUrl(
            coreConfig.getUser().ovhSubsidiary,
          ),
          '_blank',
        );
      },
    },
    atInternet: {
      rename: 'netapp::dashboard::configure-network',
    },
  });
};
