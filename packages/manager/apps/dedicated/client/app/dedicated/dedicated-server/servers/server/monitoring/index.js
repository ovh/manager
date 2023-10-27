import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedServerMonitoringLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-server.server.dashboard.monitoringUpdate.**',
      {
        url: '/monitoring/update',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./monitoring.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
