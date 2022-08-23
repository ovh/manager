import { PREFIX_TRACKING_ONBOARDING } from './onboarding.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.onboarding', {
    url: '/onboarding',
    component: 'nashaOnboarding',
    resolve: {
      breadcrumb: () => null,
      goToOrder: /* @ngInject */ ($state) => () => $state.go('nasha.order'),
    },
    atInternet: {
      rename: `nasha::${PREFIX_TRACKING_ONBOARDING}`,
    },
  });
};
