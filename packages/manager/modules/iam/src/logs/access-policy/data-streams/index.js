import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerIAMAccessPolicyLogsDataStreamsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.logs.access-policy.data-streams.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./access-policy-streams.module').then((mod) => {
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);

export default moduleName;
