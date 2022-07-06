import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerNashaDashboardPartitionSnapshotsDeleteLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.dashboard.partition.snapshots.delete.**', {
      url: '/:customSnapshotName/delete',
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
