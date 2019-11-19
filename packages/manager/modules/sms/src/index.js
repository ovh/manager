import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import sms from './sms';

const moduleName = 'ovhManagerSms';


angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  'ovhManagerCore',
  sms,
])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('sms', {
      url: '/sms',
      abstract: true,
    });

    // $stateProvider.state('sms.service.**', {
    //   url: '/sms',
    //   lazyLoad: ($transition$) => {
    //     const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

    //     return import('./telecom-sms.component')
    //       .then(mod => $ocLazyLoad.inject(mod.default || mod));
    //   },
    // });
  });

export default moduleName;
