import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'enterpriseCloudDatabaseServiceLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('enterprise-cloud-database.service.**', {
      url: '/:clusterId',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./service.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
