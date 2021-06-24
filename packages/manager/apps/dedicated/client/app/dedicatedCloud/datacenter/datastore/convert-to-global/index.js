import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'dedicatedCloudDatacenterDatastoreConvertToGlobalLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedCloud.details.datacenter.details.datastores.convertToGlobal.**',
      {
        url: '/convert-to-global',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-datastore-convert-to-global.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
