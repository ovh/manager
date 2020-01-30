import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsGuides';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.guides.**', {
      url: '/guides',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms-guides.component').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  });

export default moduleName;
