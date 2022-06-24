import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import ovhManagerCore from '@ovh-ux/manager-core';

import sms from './sms';

const moduleName = 'ovhManagerSmsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', sms, ovhManagerCore])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('sms', {
          url: '/sms',
          redirectTo: 'sms.index',
          resolve: {
            breadcrumb: () => 'SMS',
          },
        })
        .state('sms.onboarding.**', {
          url: '/onboarding',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./onboarding/onboarding.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('sms.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./sms.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });
    },
  );

export default moduleName;
