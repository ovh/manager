import { SupportLevel } from '@ovh-ux/manager-models';

const hitName = 'netapp::onboarding';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.onboarding', {
    url: '/onboarding',
    views: {
      netappContainer: {
        component: 'ovhManagerNetAppOnboarding',
      },
    },

    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((services) =>
          services.data.length !== 0
            ? {
                state: 'netapp.index',
              }
            : false,
        ),

    resolve: {
      resources: /* @ngInject */ ($http) => $http.get('/storage/netapp'),
      hasRecommendedSupportLevel: /* @ngInject */ (coreConfig) =>
        !new SupportLevel(coreConfig.getUser().supportLevel).isStandard(),
      goToOrder: ($state) => () => $state.go('netapp.order'),
      breadcrumb: () => null,
      trackClick: /* @ngInject */ (atInternet) => (suffix) => {
        atInternet.trackClick({
          name: `${hitName}::${suffix}`,
          type: 'action',
        });
      },
    },
    atInternet: {
      rename: hitName,
    },
  });
};
