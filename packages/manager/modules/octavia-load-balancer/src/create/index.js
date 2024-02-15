import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import './style.scss';

const moduleName = 'ovhManagerOctaviaLoadBalancerCreateLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('octavia-load-balancer.create.**', {
      url: '/create',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
