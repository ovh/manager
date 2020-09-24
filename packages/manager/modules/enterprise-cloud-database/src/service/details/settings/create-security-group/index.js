import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsSettingsCreateSecurityGroupLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'enterprise-cloud-database.service.details.settings.create-security-group.**',
      {
        url: '/create-security-group',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./create-security-group.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
