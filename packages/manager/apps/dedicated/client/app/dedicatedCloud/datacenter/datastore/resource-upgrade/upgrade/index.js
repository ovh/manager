import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'dedicatedCloudDatacenterDatastoreResourceUpgradeLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedClouds.datacenter.datastores.resourceUpgrade.**',
      {
        url: '/upgradeResource',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-datastore-resource-upgrade.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
