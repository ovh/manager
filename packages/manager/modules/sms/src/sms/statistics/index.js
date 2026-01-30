import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsStatisticsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.statistics.**', {
      url: '/statistics',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms-statistics.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  });

export default moduleName;
