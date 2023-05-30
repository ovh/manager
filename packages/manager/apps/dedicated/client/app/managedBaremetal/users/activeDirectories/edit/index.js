import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'managedBaremetalUsersActiveDirectoriesEditLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.users.federation-edit.**',
      {
        url: '/federation/edit',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./federation-edit.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
