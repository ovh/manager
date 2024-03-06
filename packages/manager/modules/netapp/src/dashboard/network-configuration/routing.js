import { VRACK_SERVICES_STATUS } from '../constants';
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
      vrackServices: /* @ngInject */ (NetAppDashboardService) =>
        NetAppDashboardService.getVrackServices().then(({ data }) =>
          data.reduce((vrackServicesArray, vs) => {
            if (
              vs.currentState.productStatus !== VRACK_SERVICES_STATUS.DISABLED
            ) {
              const name = vs.currentState.displayName || vs.id;
              vrackServicesArray.push({
                ...vs,
                display: {
                  name,
                  nameWithVrackId: vs.currentState.vrackId
                    ? `${name} (${vs.currentState.vrackId})`
                    : name,
                },
              });
            }
            return vrackServicesArray;
          }, []),
        ),
      createVrackServiceLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('vrack-services', `#/create`),
      createSubnetLink: /* @ngInject */ (coreURLBuilder) => (vrackServicesId) =>
        coreURLBuilder.buildURL(
          'vrack-services',
          `#/${vrackServicesId}/createsubnet`,
        ),
    },
    atInternet: {
      rename: 'netapp::dashboard::configure-network',
    },
  });
};
