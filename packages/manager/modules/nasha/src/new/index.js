import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerNashaNewLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('nasha.new.**', {
      url: '/new',
      lazyLoad: (transition) =>
        import('./new.module').then((mod) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(mod.default || mod),
        ),
    });
  },
);

export default moduleName;
