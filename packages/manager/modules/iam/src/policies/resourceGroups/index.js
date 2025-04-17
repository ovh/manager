import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';

const moduleName = 'ovhManagerIAMDashboardResourceGroupsLazyLoading';

angular.module(moduleName, [uiRouter, ocLazyLoad]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.policies.resourceGroups.**', {
      url: '/resource-groups',
      lazyLoad: (transition) =>
        import('./resourceGroups.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
