import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedServerTagManagerLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-server.server.dashboard.tag-manager.**',
      {
        url: '/tag-manager',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./tag-manager.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
