import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsSettingsCreateRuleLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'enterprise-cloud-database.service.details.settings.add-rule.**',
      {
        url: '/add-rule',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./create-rule.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
