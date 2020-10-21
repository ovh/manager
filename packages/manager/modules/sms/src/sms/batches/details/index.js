import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsBatchesDetails';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', 'ovhManagerCore'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('sms.service.batches.details.**', {
        url: '/batches',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./telecom-sms-batches-details.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
