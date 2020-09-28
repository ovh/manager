import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';

const moduleName = 'ovhCloudConnectDetailsDatacenterAddExtraLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'cloud-connect.details.overview.datacenter-add-extra.**',
        {
          url: '/datacenter/:datacenterId/extra/add',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./add-extra.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  );

export default moduleName;
