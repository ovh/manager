import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedServerDashboardUpgradeRequest';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.dashboard.upgrade.**', {
        url: '/upgrade/:selectedUpgrade',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./upgrade-request.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
