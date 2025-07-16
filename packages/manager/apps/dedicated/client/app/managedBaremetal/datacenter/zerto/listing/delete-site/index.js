import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerManagedBaremetalDatacenterZertoDeleteSiteModuleLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.listing.deleteSite.**',
      {
        url: '/delete-site/:siteId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./delete-site.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
