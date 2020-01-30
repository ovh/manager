import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsSenders';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.senders.**', {
      url: '/senders',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms-senders.component').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  });

export default moduleName;
