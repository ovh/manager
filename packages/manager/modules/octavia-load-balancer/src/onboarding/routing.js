import { TRACKING_NAME } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding', {
    url: '/onboarding',
    component: 'octaviaLoadBalancerOnboarding',
    resolve: {
      breadcrumb: ($translate) => $translate.instant('octavia_load_balancer'),
    },
    atInternet: {
      rename: TRACKING_NAME,
    },
  });
};
