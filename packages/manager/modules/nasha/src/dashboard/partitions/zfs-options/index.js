import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNashaDashboardPartitionsZfsOptionsLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'nasha.dashboard.partitions.partition.zfs-options.**',
      {
        url: '/zfs-options',
        lazyLoad: (transition) =>
          import('./zfs-options.module').then((module) =>
            transition
              .injector()
              .get('$ocLazyLoad')
              .inject(module.default),
          ),
      },
    );
  },
);

export default moduleName;
