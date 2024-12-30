import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

const moduleName = 'ovhCloudConnectCheckBGPPeeringLazyLoading';

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
      $stateProvider.state(
        'cloud-connect.details.overview.check-bgp-peering.**',
        {
          url: '/check-bgp-peering',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./check-bgp-peering.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
