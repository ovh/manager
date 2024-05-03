import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerOctaviaLoadBalancerLogsDataStreamsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'octavia-load-balancer.loadbalancer.logs.data-streams.**',
      {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./data-streams.module').then((mod) => {
            return $ocLazyLoad.inject(mod.default || mod);
          });
        },
      },
    );
  },
);

export default moduleName;
