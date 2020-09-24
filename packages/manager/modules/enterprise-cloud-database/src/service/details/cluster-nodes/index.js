import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsClusterSizeLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'enterprise-cloud-database.service.details.cluster-nodes.**',
      {
        url: '/cluster-nodes',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./cluster-nodes.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
