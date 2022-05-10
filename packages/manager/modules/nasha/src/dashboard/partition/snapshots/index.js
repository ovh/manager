import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'nashaDashboardPartitionSnapshotsLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.dashboard.partition.snapshots.**', {
      url: '/snapshots',
      lazyLoad: (transition) =>
        import('./snapshots.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
