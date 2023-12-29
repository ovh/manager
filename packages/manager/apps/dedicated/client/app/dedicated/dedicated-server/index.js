import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedServerLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.dedicated-server.**', {
      url: '/server',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./dedicated-server.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });

    $urlRouterProvider.when(/^\/configuration\/server/, () => {
      window.location.href = window.location.href.replace(
        '/configuration/server',
        '/server',
      );
    });

    $urlRouterProvider.when(/^\/configuration\/servers/, () => {
      window.location.href = window.location.href.replace(
        '/configuration/servers',
        '/server',
      );
    });
  },
);

export default moduleName;
