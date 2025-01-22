import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

const moduleName = 'ovhCloudConnectDiagnosticsDetailsLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
    'ovh-api-services',
    ngOvhCloudUniverseComponents,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('cloud-connect.details.diagnostics.**', {
        url: '/diagnostics',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./diagnostics.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
