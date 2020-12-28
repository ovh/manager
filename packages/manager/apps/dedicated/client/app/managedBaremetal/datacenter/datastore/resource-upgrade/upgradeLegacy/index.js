import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'managedBaremetalDatacenterDatastoreResourceUpgradeLegacyLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.datacenter.datastores.resourceUpgradeLegacy.**',
      {
        url: '/upgradeResourceLegacy',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./resource-upgrade-legacy.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
