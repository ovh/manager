import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsOptions';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.options.**', {
      url: '/options',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms-options.component')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
