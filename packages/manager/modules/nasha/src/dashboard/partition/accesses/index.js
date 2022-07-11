import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'nashaDashboardPartitionAccessesLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.dashboard.partition.accesses.**', {
      url: '/accesses',
      lazyLoad: (transition) =>
        import('./accesses.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
