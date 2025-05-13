import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerPccServicePackUpgradeConfigurationOnlyLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.servicePackUpgrade.configurationOnly.**',
      {
        url: '/configurationOnly',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./configuration-only.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
