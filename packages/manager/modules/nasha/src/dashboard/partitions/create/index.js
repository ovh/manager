import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNashaDashboardPartitionsCreateLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.dashboard.partitions.create.**', {
      url: '/create',
      lazyLoad: (transition) =>
        import('./create.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
