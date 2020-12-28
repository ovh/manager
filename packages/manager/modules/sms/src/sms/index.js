import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import dashboard from './dashboard';
import order from './order';

import service from './telecom-sms.service';

const moduleName = 'ovhManagerSmsService';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ovhManagerCore',
    dashboard,
    order,
  ])
  .service('SmsService', service)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('sms.service.**', {
        url: '/:serviceName',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./telecom-sms.component').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
