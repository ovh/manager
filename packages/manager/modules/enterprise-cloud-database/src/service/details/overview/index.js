import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsOverviewLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'enterprise-cloud-database.service.details.overview.**',
      {
        url: '/overview',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./overview.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
