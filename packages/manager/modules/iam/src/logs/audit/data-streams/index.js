import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerIAMAuditLogsDataStreamsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.logs.audit.data-streams.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./audit-data-streams.module').then((mod) => {
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);

export default moduleName;
