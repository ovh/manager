import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerTelecomDashboardIdentityCheckFormCancellationLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('identity-check.cancellation.**', {
      url: '/identity-check/cancellation',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./cancellation.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
