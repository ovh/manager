import { TRACKING_BASE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.index.vrack', {
    url: '/vrack-configuration',
    views: {
      modal: {
        component: 'ovhManagerNetappVrackConfiguration',
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
      trackPage: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackPage({
          name: `${TRACKING_BASE}-${tracker}`,
        }),
      goBack: /* @ngInject */ ($state, trackClick) => (trackLabel) => {
        if (trackLabel) trackClick(trackLabel);
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
        NetAppDashboardService,
        vracks,
        networkInformations,
      ) =>
        NetAppDashboardService.filterAllowedVrack(
          vracks,
          networkInformations.vRackServicesId,
        ),
    },
    atInternet: {
      rename: 'netapp::dashboard::configure-vrack',
    },
  });
};
