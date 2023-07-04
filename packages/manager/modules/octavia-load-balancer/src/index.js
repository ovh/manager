import angular from 'angular';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'oclazyload';

import './index.scss';

const moduleName = 'ovhManagerOctaviaLoadBalancerLazyLoading';

angular
  .module(moduleName, ['ngUiRouterBreadcrumb', 'ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('octavia-load-balancer.**', {
        url: '/octavia-load-balancer/{projectId:[0-9a-zA-Z]{32}}',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./octavia-load-balancer.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
