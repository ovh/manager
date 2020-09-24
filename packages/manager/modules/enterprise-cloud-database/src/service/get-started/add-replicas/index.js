import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'enterpriseCloudDatabaseServiceGetStartedAddReplicasLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'enterprise-cloud-database.service.get-started.add-replicas.**',
      {
        url: '/add-replicas',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./add-replicas.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
