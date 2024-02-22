import { TRACKING_BASE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.index.vrack', {
    url: '/vrack-configuration',
    views: {
      modal: {
        component: 'ovhManagerNetAppVrackConfiguration',
      },
    },
    layout: 'modal',
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
        $translate.instant('netapp_vrack_configuration_title'),
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
      availableVracks: /* @ngInject */ (
        NetappVrackConfigurationService,
        vracks,
        networkInformations,
      ) =>
        NetappVrackConfigurationService.filterAllowedVrack(
          vracks,
          networkInformations.vRackServicesId,
        ),
      goToVrackOrder: /* @ngInject */ (
        $window,
        coreConfig,
        NetappVrackConfigurationService,
        trackClick,
      ) => (event) => {
        event.preventDefault();
        trackClick('add-vrack');
        $window.open(
          NetappVrackConfigurationService.getVrackOrderUrl(
            coreConfig.getUser().ovhSubsidiary,
          ),
          '_blank',
        );
      },
    },
    atInternet: {
      rename: 'netapp::dashboard::configure-vrack',
    },
  });
};
