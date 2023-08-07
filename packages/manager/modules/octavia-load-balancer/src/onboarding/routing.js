import { TRACKING_NAME } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding', {
    url: '/onboarding',
    component: 'octaviaLoadBalancerOnboarding',
    resolve: {
      breadcrumb: () => null,
    },
    atInternet: {
      rename: TRACKING_NAME,
    },
  });
};
