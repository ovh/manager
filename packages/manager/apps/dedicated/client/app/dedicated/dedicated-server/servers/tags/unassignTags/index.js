import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedServerUnassignTagsLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicated-server.server.tags.unassign.**', {
      url: '/unassign',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./unassign-tags.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
