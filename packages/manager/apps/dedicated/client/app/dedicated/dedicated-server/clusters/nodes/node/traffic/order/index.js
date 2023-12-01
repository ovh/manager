import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedClusterNodeTrafficOrderLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    const parentStates = [
      'app.dedicated-cluster.cluster.node.dashboard',
      'app.dedicated-cluster.cluster.node.interfaces',
    ];

    parentStates.forEach((parent) => {
      $stateProvider.state(`${parent}.traffic-order.**`, {
        url: '/traffic-order',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./traffic-order.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    });
  },
);

export default moduleName;
