import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPrivateDatabaseLogsDataStreamsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.private-database.dashboard.logs.data-streams.**',
      {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./private-database-data-streams.module').then(
            (mod) => {
              return $ocLazyLoad.inject(mod.default || mod);
            },
          );
        },
      },
    );
  },
);

export default moduleName;
