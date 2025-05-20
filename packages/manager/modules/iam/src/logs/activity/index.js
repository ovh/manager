import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerIAMActivityLogsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.logs.activity.**', {
      url: '/activity',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./activity-logs.module').then((mod) => {
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);

export default moduleName;
