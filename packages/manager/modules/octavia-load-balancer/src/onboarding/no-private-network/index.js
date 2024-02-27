import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName =
  'ovhManagerOctaviaLoadBalancerOnboardingNoPrivateNetworkLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'octavia-load-balancer.onboarding.no-private-network.**',
      {
        url: '/no-private-network',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
