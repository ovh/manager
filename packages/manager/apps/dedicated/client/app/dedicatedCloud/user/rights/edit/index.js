import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'dedicatedCloudUserRightsEditLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.users.rights.edit.**', {
      url: '/edit',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./dedicatedCloud-user-rights-edit.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  },
);

export default moduleName;
