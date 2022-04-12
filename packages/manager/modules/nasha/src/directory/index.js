import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNashaDirectoryLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.directory.**', {
      lazyLoad: (transition) =>
        import('./directory.module').then((mod) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(mod.default || mod),
        ),
    });
  },
);

export default moduleName;
