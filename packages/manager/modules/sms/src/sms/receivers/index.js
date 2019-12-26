import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsReceivers';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.receivers.**', {
      url: '/receivers',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms-receivers.component').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  });

export default moduleName;
