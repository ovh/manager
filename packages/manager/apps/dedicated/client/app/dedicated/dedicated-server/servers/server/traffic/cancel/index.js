import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedServerTrafficCancelLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    const parentStates = [
      'app.dedicated-server.server.dashboard',
      'app.dedicated-server.server.interfaces',
    ];
    parentStates.forEach((parent) => {
      $stateProvider.state(`${parent}.traffic-cancel.**`, {
        url: '/traffic-cancel',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./traffic-cancel.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    });
  },
);

export default moduleName;
