import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNashaDashboardPartitionsEditSizeLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.dashboard.partitions.partition.edit-size.**', {
      url: '/edit-size',
      lazyLoad: (transition) =>
        import('./edit-size.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
