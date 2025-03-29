import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerIAMAccessPolicyLogsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.logs.access-policy.**', {
      url: '/access-policy',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./access-policy-logs.module').then((mod) => {
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);

export default moduleName;
