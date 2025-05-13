import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

const moduleName = 'ovhCloudConnectDetailsUnlockPortLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
    ngOvhCloudUniverseComponents,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('cloud-connect.details.overview.unlock-port.**', {
        url: '/port/:interfaceId/unlock',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./unlock-port.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
