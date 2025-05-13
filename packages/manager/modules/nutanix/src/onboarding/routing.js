import {
  PREFIX_TRACKING_NUTANIX,
  PREFIX_TRACKING_ONBOARDING,
} from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.onboarding', {
    url: '/onboarding',
    component: 'nutanixOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('clusters')
        .then((services) =>
          services.length !== 0
            ? {
                state: 'nutanix.index',
              }
            : false,
        ),
    resolve: {
      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: `${PREFIX_TRACKING_NUTANIX}::${PREFIX_TRACKING_ONBOARDING}`,
    },
  });
};
