import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.onboarding.no-private-network', {
    url: '/no-private-network',
    resolve: {
      breadcrumb: () => null,
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
    views: {
      modal: {
        component: 'octaviaLoadBalancerOnboardingNoPrivateNetwork',
      },
    },
    layout: 'modal',
    atInternet: {
      rename: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::create-private-network`,
    },
  });
};
