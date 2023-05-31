import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';

const moduleName = 'ovhManagerIAMPolicyPoliciesDeleteLazyLoading';

angular.module(moduleName, [uiRouter, ocLazyLoad]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.policy.policies.delete.**', {
      url: '/delete',
      lazyLoad: (transition) =>
        import('./delete.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
