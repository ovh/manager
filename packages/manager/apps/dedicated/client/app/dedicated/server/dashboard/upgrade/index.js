import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

const moduleName = 'ovhManagerDedicatedServerDashboardUpgrade';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.dashboard.upgrade.**', {
        url: '/upgrade/:upgradeType',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./upgrade.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
