import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'enterpriseCloudDatabaseServiceDetailsSettingsEditSecurityGroupLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'enterprise-cloud-database.service.details.settings.edit-security-group.**',
      {
        url: '/edit-security-group',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./edit-security-group.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
